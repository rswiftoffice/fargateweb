export type RequestStatus = "idle" | "pending" | "succeeded" | "failed";

export interface GenericState {
  createStatus: RequestStatus;
  getDetailStatus: RequestStatus;
  makeVehicalAvailable?: RequestStatus;
  updateStatus: RequestStatus;
  deleteStatus: RequestStatus;
  listStatus: RequestStatus;
}
