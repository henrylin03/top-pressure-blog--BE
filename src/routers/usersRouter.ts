import { Router } from "express";
import { newUserPost } from "@/controllers/usersController";

const usersRouter = Router();
usersRouter.post("/new", ...newUserPost);

export default usersRouter;
