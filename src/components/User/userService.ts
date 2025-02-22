import { User } from "./userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async ({
  email,
  password,
  role,
  currentLocation,
}: {
  email: string;
  password: string;
  role: "DRIVER" | "RIDER";
  currentLocation: {
    type: String;
    coordinates: [];
  };
}) => {
  const existingUser = await User.findOne({ email, role });
  if (existingUser)
    throw new Error("An account with this email already exists!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const createUser = await User.create({
    email,
    role,
    password: hashedPassword,
    currentLocation,
  });

  if (!createUser) throw new Error("Culd not create account");

  return "User Created Succesfully!";
};

export const login = async ({
  email,
  role,
  password,
}: {
  email: string;
  role: "DRIVER" | "RIDER";
  password: string;
}): Promise<string> => {
  const user = await User.findOne({ email, role });
  if (!user) throw new Error("This user does not exist!");

  const comparePassword = bcrypt.compare(password, user.password);
  if (!comparePassword) throw new Error("Incorrect credentials!");

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return token;
};
