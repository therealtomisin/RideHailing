import express from "express";
import dotenv from "dotenv";
import connectDB from "./database";
import { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import rideRoutes from "./routes/rideRoutes";

const app = express();
const port = 5005;
const routes = express.Router();
app.use(express.json({ limit: "32mb" }));
app.use(express.urlencoded({ limit: "32mb", extended: true }));

dotenv.config();
connectDB();

app.use("/user", userRoutes);
app.use("/ride", rideRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("this is the success response");
});

app.listen(port, () => {
  console.log(`>>>>>>>>>> Server listening on port ${port}`);
});
