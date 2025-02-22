import { LocationType } from "./rideTypes";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "RIDER" | "DRIVER"; // Role-based access
  isAvailable?: boolean; // Only relevant for drivers
  hasVerifiedEmail: boolean;
  currentLocation?: LocationType | string;
  vehicle?: {
    model: string;
    plateNumber: string;
    color: string;
  };
}
