import { Router } from "express";
import {
	addNewDraftPost,
	deletePost,
	editPost,
	getPost,
	getPublishedPosts,
	publishPost,
} from "@/controllers/postsController";
import commentsRouter from "./commentsRouter";

const postsRouter = Router();

postsRouter.get("/", getPublishedPosts);
postsRouter.post("/", addNewDraftPost);

postsRouter.get("/:postId", getPost);
postsRouter.put("/:postId", editPost);
postsRouter.delete("/:postId", deletePost);
postsRouter.patch("/:postId/publish", publishPost);
// postsRouter.patch("/:postId/draft", unpublishPost);

postsRouter.use("/:postId/comments", commentsRouter);

export default postsRouter;
