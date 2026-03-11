import type { Request, Response } from "express";
import { prisma } from "@/lib/prisma";

const getComments = async (req: Request, res: Response) => {
	const { postId } = req.params;
	const post = await prisma.post.findUnique({
		where: { id: String(postId) },
	});
	if (!postId || !post)
		return res.status(404).json({ error: "Post not found" });

	const comments = await prisma.comment.findMany({
		where: { postId: String(postId) },
	});
	return res.status(200).json({
		message: `${comments.length} comments retrieved for post`,
		comments,
	});
};

export { getComments };
