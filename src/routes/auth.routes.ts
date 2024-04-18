import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {})


router.post("/verify", async (req: Request, res: Response, next: NextFunction) => {})


router.post("/resend-verification-mail", async (req: Request, res: Response, next: NextFunction) => {})


router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {})


router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => {})


router.post("/reset-password", async (req: Request, res: Response, next: NextFunction) => {})


router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {})

export { router as authRoutes }