import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan"
import path from "path";
import routes from "./routes"
import { errorHandler } from "./middlewares/error";

dotenv.config();

const app: Application = express();
app.use(helmet());
app.use(
  cors({
    origin: [process.env.CLIENT_URL as string, "*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application successfully loaded",
  });
});

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
