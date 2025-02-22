import mongoose from "mongoose";
import { User } from "../components/User/userModel";

const connectDB = async () => {
  const mongoURI = process.env.mongoDBURI as string;
  try {
    await mongoose.connect(mongoURI);

    await User.updateMany(
      { currentLocation: { $exists: false } },
      { $set: { currentLocation: { type: "Point", coordinates: [0, 0] } } }
    );

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
