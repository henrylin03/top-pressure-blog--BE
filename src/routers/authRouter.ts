import { Router } from "express";
import { authenticateWithJwt, loginPost } from "@/controllers/authController";

const authRouter = Router();

authRouter.get("/protected", authenticateWithJwt);
authRouter.post("/login", loginPost);

export default authRouter;
