import mongoose, { FilterQuery, HydratedDocument } from "mongoose";
import {
  ICreateRide,
  IReadRide,
  IRide,
  IUpdateRide,
  LocationType,
} from "../../types/rideTypes";
import { IUser } from "../../types/userTypes";
import { distanceCalculator } from "../../utils/distanceCalculator";
import { User } from "../User/userModel";
import { Ride } from "./rideModel";
import _ from "lodash";

export const createRide = async ({
  email,
  rider,
  pickupLocation,
  dropoffLocation,
}: ICreateRide & { email: string }): Promise<Partial<IRide>> => {
  const isActiveDriver = await User.findOne({
    email,
    role: "DRIVER",
    isAvailable: true,
  });
  if (isActiveDriver)
    throw new Error("Cannot request ride as an active driver!");
  const userActiveRide = await Ride.findOne({
    rider,
    status: { $in: ["IN_PROGRESS", "ACCEPTED"] },
  });
  if (userActiveRide)
    throw new Error("Cannot request for ide when rde is in progress.");
  const newRide = await Ride.create({
    rider,
    pickupLocation,
    dropoffLocation,
    fare: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
  });

  return newRide;
};

export const matchRiderWithDriver = async ({
  rider,
  pickupLocation,
}: {
  rider: string;
  pickupLocation: string | LocationType;
}): Promise<IUser & { distance: number }> => {
  const requestingRider = await User.findOne({ _id: rider });

  if (!requestingRider) throw new Error("No rider found!");

  // if (requestingRider.)
  const activeRide = await Ride.findOne({
    rider: requestingRider.id,
    status: { $in: ["IN_PROGRESS", "ACCEPTED"] },
  });

  if (activeRide)
    throw new Error("Cannot match rider when ride is in progress!");

  const activeDriver = await User.findOne({
    role: "DRIVER",
    currentLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            (pickupLocation as LocationType).long,
            (pickupLocation as LocationType).lat,
          ],
        },
        $maxDistance: 1000000000000,
      },
    },
    isAvailable: true,
  })
    .select(
      "name email phoneNumber role isAvailable hasVerifiedEmail currentLocation vehicle createdAt updatedAt"
    )
    .lean();

  if (!activeDriver)
    throw new Error("There are no active drivers in your location.");

  const distance = distanceCalculator(
    {
      latitude: (pickupLocation as LocationType).lat,
      longitude: (pickupLocation as LocationType).long,
    },
    {
      latitude: (activeDriver.currentLocation as LocationType).coordinates[1],
      longitude: (activeDriver.currentLocation as LocationType).coordinates[0],
    }
  );

  return {
    ...activeDriver,
    distance,
  };
};

export const getRides = async (query: IReadRide): Promise<IRide[]> => {
  const ridesPayload = getRidesPayload(query);
  const skip = query.skip ?? 0;
  const limit = query.limit ?? 0;
  const rides = await Ride.find(ridesPayload)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return rides;
};

export const getSingleRide = async (query: IReadRide): Promise<IRide> => {
  const ridesPayload = getRidesPayload(query);

  console.log("mind games >> ", ridesPayload);

  const singleRide = await Ride.findOne(ridesPayload);

  if (!singleRide) throw new Error("No ride found!");

  return singleRide;
};

export const updateRide = async (payload: IUpdateRide) => {
  const updatePayload = getRidesPayload(payload);
  const currentRide = await Ride.findOne({ id: updatePayload.id });

  if (!currentRide) throw new Error("Ride does not exist!");

  if (currentRide.status === "COMPLETED")
    throw new Error("Cannot update a completed trip!");

  if (updatePayload.status) {
    return await updateRideStatus(updatePayload, currentRide);
  } else {
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: payload.id },
      { $set: { ...updatePayload } },
      { new: true }
    );
    return updatedRide?.populate("driver");
  }
};

const updateRideStatus = async (
  updatePayload: Partial<IRide>,
  currentRide: IRide
) => {
  if (updatePayload.status === "ACCEPTED" && currentRide.status !== "PENDING")
    throw new Error("Cannot accept a ride that is not pending!");

  if (
    updatePayload.status === "COMPLETED" &&
    currentRide.status !== "IN_PROGRESS"
  )
    throw new Error("Cannot complete a trip not in progress!");

  const updatedRide = await Ride.findOneAndUpdate(
    { _id: updatePayload.id },
    {
      $set: {
        ...updatePayload,
        ...(updatePayload.status === "COMPLETED" && {
          completedAt: new Date(),
        }),
      },
    },
    { new: true }
  );
  if (!updatedRide) throw new Error("Could not update ride!");

  await User.findOneAndUpdate(
    { id: updatePayload.driver },
    {
      $set: {
        isAvailable:
          updatePayload.status === "COMPLETED" || "CANCELLED" || "PENDING"
            ? true
            : false,
      },
    },
    { new: true }
  );

  return updatedRide.populate("driver");
};

const getRidesPayload = ({
  status,
  rider,
  driver,
  createdAt,
  id,
  pickupLocation,
  dropoffLocation,
  completedAt,
  fare,
}: IReadRide): Partial<IReadRide> => {
  const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

  return {
    ...(id &&
      isValidObjectId(id as string) && {
        _id: new mongoose.Types.ObjectId(id),
      }),
    ...(status && { status }),
    ...(rider &&
      isValidObjectId(rider as string) && {
        rider: new mongoose.Types.ObjectId(rider),
      }),
    ...(driver &&
      isValidObjectId(driver as string) && {
        driver: new mongoose.Types.ObjectId(driver),
      }),
    ...(pickupLocation && { pickupLocation }),
    ...(dropoffLocation && { dropoffLocation }),
    ...(createdAt && { createdAt }),
    ...(completedAt && { completedAt }),
    ...(fare && { fare }),
  };
};
