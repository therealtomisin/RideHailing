import express from "express";
import { postCreateUser, postLogin } from "../components/User/userController";
import { authenticateAndAuthorize } from "../middlewares/authenticate";
import { getMultipleRides } from "../components/Rides/rideController";
const userRoutes = express.Router();

userRoutes.post("/login", postLogin);
userRoutes.post("/create", postCreateUser);
userRoutes.get(
  "/:id/rides",
  authenticateAndAuthorize(["RIDER"]),
  getMultipleRides
);

export default userRoutes;
