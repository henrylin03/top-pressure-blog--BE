import { Router } from "express";
import { getComments } from "@/controllers/commentsController";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get("/", getComments);

export default commentsRouter;
