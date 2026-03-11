import type { Request, Response } from "express";
import { prisma } from "@/lib/prisma";

const getComments = async (req: Request, res: Response) => {
	const { postId } = req.params;
	if (!postId) return res.status(404).json({ error: "Post ID not found" });

	const allPosts = await prisma.comment.findMany({
		where: { postId: String(postId) },
	});
	return res.status(200).json({
		message: `${allPosts.length} comments retrieved for post`,
		allPosts,
	});
};

export { getComments };
