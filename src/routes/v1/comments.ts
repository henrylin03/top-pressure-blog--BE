import { Router } from "express";
import {
	addComment,
	deleteComment,
	editComment,
	getComments,
} from "@/controllers/comments.js";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/", getComments);
commentsRouter.post("/", addComment);
commentsRouter.put("/:commentId", editComment);
commentsRouter.delete("/:commentId", deleteComment);

export default commentsRouter;
