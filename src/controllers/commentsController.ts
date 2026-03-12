import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { prisma } from "@/lib/prisma";
import { checkCommentExists, checkPostExists } from "@/middleware/checkExists";
import validateComment from "@/middleware/validation/validateComment";
import type { AuthenticatedRequest } from "@/types/types";
import { authenticateWithJwt } from "../middleware/auth";

const addComment = [
	authenticateWithJwt,
	checkPostExists,
	validateComment,
	async (req: AuthenticatedRequest, res: Response) => {
		const { text: commentText } = matchedData(req, {
			onlyValidData: false,
		});
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array(), commentText });

		try {
			const newComment = await prisma.comment.create({
				data: {
					text: commentText,
					postId: String(req.params.postId),
					authorId: req.user.id,
				},
			});
			return res
				.status(201)
				.json({ message: "New comment added", comment: newComment });
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

const deleteComment = [
	authenticateWithJwt,
	checkCommentExists,
	async (req: AuthenticatedRequest, res: Response) => {
		const { comment, user } = req;
		const { postId } = req.params;

		const postWithThisComment = await prisma.post.findUnique({
			where: { id: String(postId) },
		});

		const deleterIsPostAuthor = postWithThisComment?.authorId === user.id;
		const deleterIsCommenter = comment?.authorId === user.id;

		if (!deleterIsPostAuthor && !deleterIsCommenter)
			return res
				.status(403)
				.json({ error: "Not authorised to delete comment" });

		try {
			const _deleteComment = await prisma.comment.delete({
				where: { id: String(comment?.id) },
			});
			res.status(204).end();
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

const getComments = [
	checkPostExists,
	async (req: Request, res: Response) => {
		const { postId } = req.params;
		const comments = await prisma.comment.findMany({
			where: { postId: String(postId) },
		});
		return res.status(200).json({
			message: `${comments.length} comments retrieved for post`,
			comments,
		});
	},
];

export { addComment, deleteComment, getComments };
