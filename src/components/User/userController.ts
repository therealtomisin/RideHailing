import { Request, Response } from "express";
import { createUser, login } from "./userService";
export const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const loginUser = await login({ email, password, role });
    res.status(200).json({ token: loginUser });
  } catch (error: any) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "An error occurred while logging in",
      error: error.message || "Internal Server Error",
    });
  }
};
export const postCreateUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, currentLocation } = req.body;
    const loginUser = await createUser({
      email,
      password,
      role,
      currentLocation,
    });
    res.status(200).json({ message: loginUser });
  } catch (error: any) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "An error occurred while logging in",
      error: error.message || "Internal Server Error",
    });
  }
};
