export type Command = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  serviceId: number;
  service?: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};
