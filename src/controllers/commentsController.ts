import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { prisma } from "@/lib/prisma";
import { checkPostExists } from "@/middleware/checkExists";
import validateComment from "@/middleware/validation/validateComment";
import type { AuthenticatedRequest } from "@/types/types";
import { authenticateWithJwt } from "../middleware/auth";

const addComment = [
	authenticateWithJwt,
	checkPostExists,
	validateComment,
	async (req: AuthenticatedRequest, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		const { postId } = req.params;
		const { text: commentText } = matchedData(req, { onlyValidData: false });

		try {
			const newComment = await prisma.comment.create({
				data: {
					text: commentText,
					postId: String(postId),
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

export { addComment, getComments };
