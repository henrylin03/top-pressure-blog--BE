import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { prisma } from "@/lib/prisma";
import validateComment from "@/middleware/validation/validateComment";
import type { AuthenticatedRequest } from "@/types/types";
import { authenticateWithJwt } from "../middleware/auth";

const addComment = [
	authenticateWithJwt,
	validateComment,
	async (req: AuthenticatedRequest, res: Response) => {
		const { text: commentText } = matchedData(req, { onlyValidData: false });
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array(), commentText });

		const { postId } = req.params;
		if (!postId) return res.status(404).json({ error: "Post not found" });
		const post = await prisma.post.findUnique({
			where: { id: String(postId) },
		});
		if (!post) return res.status(404).json({ error: "Post not found" });

		try {
			const newComment = await prisma.comment.create({
				data: {
					text: commentText,
					postId: String(postId),
					authorId: req.user.id,
				},
			});
			res
				.status(200)
				.json({ message: "New comment added", comment: newComment });
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

const getComments = async (req: Request, res: Response) => {
	const { postId } = req.params;
	if (!postId) return res.status(404).json({ error: "Post ID missing" });

	const post = await prisma.post.findUnique({
		where: { id: String(postId) },
	});
	if (!post) return res.status(404).json({ error: "Post not found" });

	const comments = await prisma.comment.findMany({
		where: { postId: String(postId) },
	});
	return res.status(200).json({
		message: `${comments.length} comments retrieved for post`,
		comments,
	});
};

export { addComment, getComments };
