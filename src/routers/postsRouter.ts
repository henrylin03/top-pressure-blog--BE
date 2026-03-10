import { Router } from "express";
import {
	addNewDraftPost,
	getPost,
	getPublishedPosts,
} from "@/controllers/postsController";

const postsRouter = Router();

postsRouter.get("/", getPublishedPosts);
postsRouter.get("/:postId", getPost);

postsRouter.post("/new", addNewDraftPost);
// TODO: admin users can also _publish_ post

// TODO: after auth set up, /my-posts will return all posts of that user (assuming they are an author) - published or not. this will be like a dashboard.
// TODO: get all comments of post //? should this be separate router and controller??

export default postsRouter;
