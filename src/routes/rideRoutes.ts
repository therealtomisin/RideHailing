import express from "express";
import { authenticateAndAuthorize } from "../middlewares/authenticate";
import {
  getMultipleRides,
  getRide,
  patchAcceptRide,
  patchCompleteRide,
  postCreateRide,
  postGetClosestDriver,
} from "../components/Rides/rideController";
import { validator } from "../utils/validator";
import schema from "./schema";
const rideRoutes = express.Router();

rideRoutes.post(
  "/",
  authenticateAndAuthorize(["RIDER"]),
  validator(schema.createRide),
  postCreateRide
);
rideRoutes.post(
  "/match",
  authenticateAndAuthorize(["RIDER"]),
  postGetClosestDriver
);
rideRoutes.get(
  "/",
  authenticateAndAuthorize(["DRIVER", "ADMIN"]),
  getMultipleRides
);
rideRoutes.get("/:id", getRide);
rideRoutes.patch(
  "/:id/accept",
  authenticateAndAuthorize(["DRIVER"]),
  validator(schema.updateRide),
  patchAcceptRide
);
rideRoutes.patch(
  "/:id/complete",
  authenticateAndAuthorize(["DRIVER"]),
  validator(schema.updateRide),
  patchCompleteRide
);

export default rideRoutes;
