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

export { checkPostExists };
