import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/lib/prisma";

const attachPost = async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;
	if (!postId) return res.status(404).json({ error: "Post ID missing" });

	const post = await prisma.post.findUnique({
		where: { id: String(postId) },
	});
	if (!post) return res.status(404).json({ error: "Post not found" });

	req.post = post;

	next();
};

const attachDraftPostAndReturnPublishedPost = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const post = await prisma.post.findUnique({
			where: { id: String(req.params.postId) },
		});
		if (!post) return res.status(404).json({ error: "Post not found" });
		if (post.isPublished && post.publishedAt) res.status(200).json({ post });

		req.post = post;

		next();
	} catch (error) {
		res.status(500).json({ error });
	}
};

const attachComment = async (
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

export { attachComment, attachDraftPostAndReturnPublishedPost, attachPost };
