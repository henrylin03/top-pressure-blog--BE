import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/lib/prisma";

const checkPostExists = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { postId } = req.params;
	if (!postId) return res.status(404).json({ error: "Post ID missing" });

	const post = await prisma.post.findUnique({
		where: { id: String(postId) },
	});
	if (!post) return res.status(404).json({ error: "Post not found" });

	next();
};

const checkCommentExists = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { commentId } = req.params;
	if (!commentId) return res.status(404).json({ error: "Comment ID missing" });

	const comment = await prisma.comment.findUnique({
		where: { id: String(commentId) },
	});
	if (!comment) return res.status(404).json({ error: "Comment not found" });

	req.comment = comment;

	next();
};

export { checkCommentExists, checkPostExists };
