import { Router } from "express";
import {
	addComment,
	deleteComment,
	getComments,
} from "@/controllers/commentsController";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/", getComments);
commentsRouter.post("/", addComment);
commentsRouter.delete("/:commentId", deleteComment);

export default commentsRouter;
