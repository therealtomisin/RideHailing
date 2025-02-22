import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authenticate";
import {
  createRide,
  getRides,
  getSingleRide,
  matchRiderWithDriver,
  updateRide,
} from "./rideService";

export const getMultipleRides = async (req: AuthRequest, res: Response) => {
  try {
    const queryParams = req.query;
    const rider = req.params.id || req.user?.id;
    const userRides = await getRides({ ...queryParams, rider });
    res.status(200).json({ output: userRides });
  } catch (error: any) {
    res.status(501).json({ error: error.message });
  }
};

export const getRide = async (req: AuthRequest, res: Response) => {
  try {
    const queryParams = req.query;
    const rider = req.params.id || req.user?.id;
    const userRides = await getSingleRide({ ...queryParams, rider });
    res.status(200).json({ output: userRides });
  } catch (error: any) {
    res.status(501).json({ error: error.message });
  }
};

export const postCreateRide = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;
    const rider = req.user?.id;
    const email = req.user?.email;

    const createdRide = await createRide({ ...payload, rider, email });
    res
      .status(200)
      .json({ output: createdRide, message: "Ride Created Succesffully!" });
  } catch (error: any) {
    res.status(501).json({ error: error.message });
  }
};

export const postGetClosestDriver = async (req: AuthRequest, res: Response) => {
  try {
    const { pickupLocation } = req.body;
    const rider = req.user?.id as string;

    const matchedDriver = await matchRiderWithDriver({ rider, pickupLocation });
    res.status(200).json({ output: matchedDriver, message: "Rider Fetched!" });
  } catch (error: any) {
    res.status(501).json({ error: error.message });
  }
};

export const getUnacceptedRides = async (req: AuthRequest, res: Response) => {
  try {
    const unacceptedRides = await getRides({ status: "PENDING" });
    res
      .status(200)
      .json({ output: unacceptedRides, message: "Unaccepted rides fetched!" });
  } catch (error: any) {
    res.status(501).json({ error: error.message });
  }
};

export const patchAcceptRide = async (req: AuthRequest, res: Response) => {
  try {
    const driver = req.user?.id;
    const rideId = req.params.id;
    const updatedRide = await updateRide({
      status: "ACCEPTED",
      driver,
      id: rideId,
    });
    res.status(200).json({ output: updatedRide, message: "Ride Updated!" });
  } catch (error: any) {
    res.status(501).json({ error: error.message });
  }
};
export const patchCompleteRide = async (req: AuthRequest, res: Response) => {
  try {
    const driver = req.user?.id;
    const rideId = req.params.id;
    const updatedRide = await updateRide({
      status: "COMPLETED",
      driver,
      id: rideId,
    });
    res.status(200).json({ output: updatedRide, message: "Ride Updated!" });
  } catch (error: any) {
    res.status(501).json({ error: error.message });
  }
};
