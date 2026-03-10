import { Router } from "express";
import { loginPost } from "@/controllers/authController";

const authRouter = Router();

authRouter.post("/login", loginPost);

export default authRouter;
