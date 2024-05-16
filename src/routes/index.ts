import express from "express";
import { bannerRoutes } from "./banner.routes";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { adminRoutes } from "./admin.routes";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes"

const router = express.Router();

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/banners", bannerRoutes);
router.use("/admin", adminRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

export default router