import express from "express";
import { bannerRoutes } from "./banner.routes";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { adminRoutes } from "./admin.routes";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes"
import { paymentRoutes } from "./payment.routes";
import { orderRoutes } from "./order.routes";
import { notificationRoutes } from "./notification.routes";

const router = express.Router();

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/banners", bannerRoutes);
router.use("/admin", adminRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/payments", paymentRoutes);
router.use("/orders", orderRoutes);
router.use("/notifications", notificationRoutes);

export default router