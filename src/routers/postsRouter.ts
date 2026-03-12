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
import commentsRouter from "./commentsRouter";

const postsRouter = Router();

postsRouter.get("/", getPublishedPosts);
postsRouter.post("/", addNewDraftPost);

postsRouter.get("/:postId", getPost);
postsRouter.put("/:postId", editPost);
postsRouter.delete("/:postId", deletePost);
// TODO: deleting post also means deleting all of its comments
postsRouter.patch("/:postId/publish", publishPost);
postsRouter.patch("/:postId/draft", unpublishPost);

postsRouter.use("/:postId/comments", commentsRouter);

export default postsRouter;
