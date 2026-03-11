import { Router } from "express";
import {
	addNewDraftPost,
	deletePost,
	editPost,
	getPost,
	getPublishedPosts,
} from "@/controllers/postsController";
import commentsRouter from "./commentsRouter";

const postsRouter = Router();

postsRouter.get("/", getPublishedPosts);
postsRouter.post("/", addNewDraftPost);

postsRouter.get("/:postId", getPost);
postsRouter.put("/:postId", editPost);
//? .patch for publishing?? or just have the req.body have it in form so when user clicks 'publish' (instead of 'save to draft') we also send 'isPublished = true'??
postsRouter.delete("/:postId", deletePost);

// TODO: after auth set up, /my-posts will return all posts of that user (assuming they are an author) - published or not. this will be like a dashboard.

postsRouter.use("/:postId/comments", commentsRouter);

export default postsRouter;
