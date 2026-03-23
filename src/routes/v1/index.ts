import { Router } from "express";
import authRouter from "./auth.js";
import postsRouter from "./posts.js";
import usersRouter from "./users.js";

const router = Router();

router.use("/", authRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);

export default router;
