import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app: Application = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application successfully loaded",
  });
});

export default app;
