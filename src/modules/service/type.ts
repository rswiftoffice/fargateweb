export interface TransferServiceProps {
  currentServiceId: number;
  newServiceId: number;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransferValues {
  id: number;
  name: string;
}

export interface ServiceValues {
  name: string;
  description: string;
}
