import mongoose from "mongoose";

export interface IRide {
  id: mongoose.Types.ObjectId | string;
  rider: mongoose.Types.ObjectId | string;
  driver?: mongoose.Types.ObjectId | string;
  pickupLocation: LocationType | string;
  dropoffLocation: LocationType | string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  fare: number;
  requestedAt: Date;
  completedAt?: Date;
  updatedAt?: Date;
  additionalNotes?: string;
}

export interface ICreateRide {
  rider: string | mongoose.Types.ObjectId;
  driver: string | mongoose.Types.ObjectId;
  pickupLocation: LocationType | string;
  dropoffLocation: LocationType | string;
  additionalNotes?: string;
}

export interface IReadRide {
  id?: mongoose.Types.ObjectId | string;
  rider?: string | mongoose.Types.ObjectId;
  driver?: string | mongoose.Types.ObjectId;
  status?: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  pickupLocation?: LocationType | string;
  dropoffLocation?: LocationType | string;
  createdAt?: Date;
  completedAt?: Date;
  fare?: number;
  skip?: number;
  limit?: number;
}

export interface IUpdateRide {
  id?: mongoose.Types.ObjectId | string;
  driver?: string | mongoose.Types.ObjectId;
  status?: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  pickupLocation?: LocationType | string;
  dropoffLocation?: LocationType | string;
  completedAt?: Date;
  fare?: number;
}

export type LocationType = {
  long: number;
  lat: number;
  address?: string;
  coordinates: number[];
};
