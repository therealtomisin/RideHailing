import mongoose, { Schema } from "mongoose";
import { IRide } from "../../types/rideTypes";

const RideSchema: Schema<IRide> = new Schema(
  {
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "User" },
    pickupLocation: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
      address: { type: String },
    },
    dropoffLocation: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
      address: { type: String },
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    fare: { type: Number, required: true },
    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Ride = mongoose.model<IRide>("Ride", RideSchema);
