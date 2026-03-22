import { Router } from "express";
import authRouter from "./auth";
import postsRouter from "./posts";
import usersRouter from "./users";

const router = Router();

router.use("/", authRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);

export default router;
