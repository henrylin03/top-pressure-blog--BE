import { Router } from "express";
import {
	addNewDraftPost,
	deletePost,
	editPost,
	getPost,
	getPublishedPosts,
	publishPost,
	unpublishPost,
} from "@/controllers/postsController";
import { attachPost } from "@/middleware/attach";
import { authenticateWithJwt, checkIsAuthor } from "../middleware/auth";
import commentsRouter from "./commentsRouter";

const postsRouter = Router();

postsRouter.get("/", getPublishedPosts);
postsRouter.post("/", [authenticateWithJwt, checkIsAuthor, addNewDraftPost]);

postsRouter.get("/:postId", getPost);
postsRouter.put("/:postId", [
	authenticateWithJwt,
	checkIsAuthor,
	attachPost,
	editPost,
]);
postsRouter.delete("/:postId", [
	authenticateWithJwt,
	checkIsAuthor,
	attachPost,
	deletePost,
]);
postsRouter.patch("/:postId/publish", [
	authenticateWithJwt,
	checkIsAuthor,
	publishPost,
]);
postsRouter.patch("/:postId/draft", [
	authenticateWithJwt,
	attachPost,
	checkIsAuthor,
	unpublishPost,
]);

postsRouter.use("/:postId/comments", commentsRouter);

export default postsRouter;
