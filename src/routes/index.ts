import express from "express";
import { bannerRoutes } from "./banner.routes";

const router = express.Router();

router.use("/banners", bannerRoutes);

export default router