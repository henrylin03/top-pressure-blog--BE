import { Router } from "express";
import { getMyPosts, newUserPost } from "@/controllers/users.js";
import { authenticateWithJwt, checkIsAuthor } from "@/middleware/auth.js";

const usersRouter = Router();

usersRouter.post("/", ...newUserPost);
usersRouter.get("/me/posts", [authenticateWithJwt, checkIsAuthor, getMyPosts]);

export default usersRouter;
