import { Router } from "express";
import { getMyPosts, newUserPost } from "@/controllers/usersController";

const usersRouter = Router();

usersRouter.post("/", ...newUserPost);
usersRouter.get("/me/posts", getMyPosts);

export default usersRouter;
