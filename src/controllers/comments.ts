import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { prisma } from "@/lib/prisma.js";
import { attachComment, attachPost } from "@/middleware/attach.js";
import { authenticateWithJwt } from "@/middleware/auth.js";
import validateComment from "@/middleware/validation/comment.js";
import type { AuthenticatedRequest } from "@/types/types.ts";

const addComment = [
	authenticateWithJwt,
	attachPost,
	validateComment,
	async (req: AuthenticatedRequest, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		const { text: commentText } = matchedData(req);
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
	attachComment,
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

const editComment = [
	authenticateWithJwt,
	attachComment,
	validateComment,
	async (req: AuthenticatedRequest, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

		const { text } = matchedData(req);

		const { comment, user } = req;
		if (String(comment?.authorId) !== user.id)
			return res.status(403).json({
				error: "InsufficientPermissions",
				message: "Only the author of a comment can edit it",
			});

		if (text === String(comment?.text))
			return res
				.status(200)
				.json({ message: "Comment unchanged", editComment });

		try {
			const editComment = await prisma.comment.update({
				where: { id: String(comment?.id) },
				data: { text, isEdited: true, lastEditedAt: new Date() },
			});
			res.status(200).json({ message: "Comment edited", editComment });
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

const getComments = [
	attachPost,
	async (req: Request, res: Response) => {
		const { post } = req;
		const comments = await prisma.comment.findMany({
			where: { postId: String(post?.id) },
			include: {
				author: true,
			},
		});
		return res.status(200).json({
			comments,
		});
	},
];

export { addComment, deleteComment, editComment, getComments };
