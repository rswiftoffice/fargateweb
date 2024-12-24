import { LoadingButton } from "@mui/lab";
import { Box, Grid, FormControl, TextField, Button } from "@mui/material";
import { isFulfilled } from "@reduxjs/toolkit";
import ErrorView from "core/components/ShowError";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import { getDestinationById, updateDestination } from "../destinationSlice";
import { Destination, DestinationValues } from "../type";

const entityName = "Destination";

const EditDestinationForm = ({ id }: { id: number }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [totalDistance, setTotalDistance] = useState(0);

  const formMethods = useForm<DestinationValues>();
  const { handleSubmit, register, setValue } = formMethods;

  const [details, setDetails] = useState<Destination>();
  const updateDataLoading = useSelector(
    (state: RootState) => state.destination.updateStatus === "pending"
  );
  const getDetailStatus = useSelector(
    (state: RootState) => state.destination.getDetailStatus
  );

  const onSubmit = async (values: DestinationValues) => {
    const { to, meterReading, startTime, endTime, totalDistance, tripDate } =
      values;
    // if (!meterReading || +meterReading < 0) {
    //   return toast.error("Please enter a valid meter reading!");
    // } else
    if (Number(totalDistance) < 0) {
      return toast.error("Please enter a valid total distance!");
    } else if (!tripDate) {
      return toast.error("Please enter a valid trip date!");
    } else if (!endTime) {
      return toast.error("Please enter a valid end time!");
    } else if (!startTime) {
      return toast.error("Please enter a valid start time!");
    } else if (!to) {
      return toast.error("Please enter a valid location!");
    }
    const startTimeDate = moment(moment(startTime).format());
    const endTimeDate = moment(moment(endTime).format());
    const action = await dispatch(
      updateDestination({
        id,
        to,
        tripDate: tripDate,
        startTime: startTimeDate.utc().format(),
        endTime: endTimeDate.utc().format(),
        meterReading: +meterReading,
        totalDistance: +totalDistance,
      })
    );
    if (isFulfilled(action)) {
      navigate("/destinations");
    }
  };

  const setValues = useCallback(
    (record: Destination) => {
      setValue("to", record.to ?? "");
      setValue(
        "tripDate",
        moment(record.trip?.tripDate).utc().format("YYYY-MM-DD")
      );
      setValue(
        "startTime",
        moment.utc(record.eLog?.startTime).local().format("YYYY-MM-DDTHH:mm")
      );
      setValue(
        "endTime",
        moment.utc(record.eLog?.endTime).local().format("YYYY-MM-DDTHH:mm")
      );
      setValue("meterReading", record?.eLog?.meterReading || 0);
      const initialTotalDistance =
        record?.eLog?.totalDistance || totalDistance || 0;
      setTotalDistance(initialTotalDistance);
      setValue("totalDistance", initialTotalDistance);
    },
    [setValue]
  );

  useEffect(() => {
    dispatch(getDestinationById(id))
      .unwrap()
      .then((data: Destination) => {
        setValues(data);
        setDetails(data);
      });
  }, [dispatch, id, setValues]);

  const calculateTotalDistance = (
    meterReading: number,
    currentMeterReading: number
  ) => {
    const distance = meterReading - currentMeterReading;
    return distance < 0 ? 0 : distance;
  };

  // const handleMeterReadingChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const meterReading = parseInt(e.target.value, 10);
  //   if (meterReading) {
  //     // Fetch the current meter reading.
  //     const currentMeterReading = details?.trip?.currentMeterReading;
  //     if (currentMeterReading !== undefined) {
  //       const distance = calculateTotalDistance(
  //         meterReading,
  //         currentMeterReading
  //       );
  //       setTotalDistance(distance);
  //       setValue("totalDistance", distance, { shouldValidate: true });
  //     }
  //     setValue("meterReading", meterReading, { shouldValidate: true });
  //   }
  // };
  const handleMeterReadingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    // if (decimalPattern.test(value)) {
    const meterReading = parseFloat(value);
    console.log(meterReading, "====first");
    if (!isNaN(meterReading)) {
      // Fetch the current meter reading
      const currentMeterReading =
        (details?.eLog?.meterReading || 0) -
        (details?.eLog?.totalDistance || 0);
      console.log(currentMeterReading, "==currentMeterReading", details);
      if (currentMeterReading !== undefined) {
        const distance = calculateTotalDistance(
          meterReading,
          currentMeterReading
        );
        setTotalDistance(distance);
        setValue("totalDistance", distance, { shouldValidate: true });
      }
      setValue("meterReading", meterReading, { shouldValidate: true });
    }
    // } else {
    //   // Optionally show a validation error or revert to previous valid input
    //   toast.error(
    //     "Please enter a valid meter reading with up to 2 decimal places."
    //   );
    // }
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

  if (getDetailStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entityName} data from the database. Try again or Please contact administration!`}
      />
    );

  if (details) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Update {entityName}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Location"
                    placeholder="Enter Destination Location"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }}
                    {...register("to")}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="End of Meter Reading"
                    placeholder="Enter To meter reading"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }}
                    type={"number"}
                    {...register("meterReading")}
                    onKeyDown={(e) => {
                      preventNegativeInput(e);
                      handleKeyDown(e);
                    }}
                    onWheel={preventScroll}
                    onChange={(e) => {
                      preventNegativeValue(e);
                      handleMeterReadingChange(e);
                    }}
                    inputProps={{ step: "0.01" }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Start Time"
                    placeholder="Enter Start Time"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }}
                    type={"datetime-local"}
                    {...register("startTime")}
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
                    {...register("endTime")}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Trip Date"
                    placeholder="Enter Trip Date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }}
                    type={"date"}
                    {...register("tripDate")}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Total Distance"
                    placeholder="Enter total distance"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }}
                    type={"number"}
                    {...register("totalDistance")}
                    value={totalDistance}
                    disabled
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateDataLoading}
                    disabled={updateDataLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/destinations")}
                    disabled={updateDataLoading}
                    disableElevation
                    sx={{ ml: 2 }}
                  >
                    {"Cancel"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    );
  }
  return <></>;
};

export default EditDestinationForm;
