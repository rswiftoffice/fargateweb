export interface MTBroadcast {
  createdAt: string;
  deleted: boolean;
  file: string;
  id: number;
  subUnitId: number;
  title: string;
  updatedAt: string;
  userId: number;
}

export interface MTBroadcastValues {
  title: string;
  file: string;
}