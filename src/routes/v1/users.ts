import { Router } from "express";
import { getMyPosts, newUserPost } from "@/controllers/users";
import { authenticateWithJwt, checkIsAuthor } from "@/middleware/auth";

const usersRouter = Router();

usersRouter.post("/", ...newUserPost);
usersRouter.get("/me/posts", [authenticateWithJwt, checkIsAuthor, getMyPosts]);

export default usersRouter;
