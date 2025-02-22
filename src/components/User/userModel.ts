// import mongoose, { Schema } from "mongoose";
// import { IUser } from "../../types/userTypes";

// const UserSchema: Schema<IUser> = new Schema(
//   {
//     name: { type: String },
//     email: { type: String, required: true },
//     password: { type: String }, // Should be hashed
//     phoneNumber: { type: String, unique: true, sparse: true },
//     role: { type: String, enum: ["RIDER", "DRIVER"], required: true },
//     isAvailable: { type: Boolean, default: true }, // Only applies to drivers,
//     hasVerifiedEmail: { type: Boolean, default: false, required: true },
//     currentLocation: {
//       lat: { type: Number },
//       lng: { type: Number },
//       address: { type: String },
//     },
//     vehicle: {
//       model: { type: String },
//       plateNumber: { type: String },
//       color: { type: String },
//     },
//   },
//   { timestamps: true }
// );

// UserSchema.index({ currentLocation: "2dsphere" });

// export const User = mongoose.model<IUser>("User", UserSchema);

import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types/userTypes";

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String }, // Should be hashed
    phoneNumber: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ["RIDER", "DRIVER"], required: true },
    isAvailable: { type: Boolean, default: true }, // Only applies to drivers
    hasVerifiedEmail: { type: Boolean, default: false, required: true },

    currentLocation: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" }, // Must be "Point"
      coordinates: {
        type: [Number],
        // required: true,
        validate: {
          validator: function (val: number[]) {
            return (
              val.length === 2 &&
              val[0] >= -180 &&
              val[0] <= 180 &&
              val[1] >= -90 &&
              val[1] <= 90
            );
          },
          message: "Invalid longitude or latitude",
        },
      },
    },

    vehicle: {
      model: { type: String },
      plateNumber: { type: String },
      color: { type: String },
    },
  },
  { timestamps: true }
);

// ✅ Correct 2dsphere index
UserSchema.index({ currentLocation: "2dsphere" });

export const User = mongoose.model<IUser>("User", UserSchema);
