import { Router } from "express";
import { getPost, getPublishedPosts } from "@/controllers/postsController";

const postsRouter = Router();

postsRouter.get("/", getPublishedPosts);
// TODO: after auth set up, /my-posts will return all posts of that user (assuming they are an author) - published or not. this will be like a dashboard.
postsRouter.get("/:postId", getPost);

// get all comments of post //? should this be separate router and controller??

export default postsRouter;
