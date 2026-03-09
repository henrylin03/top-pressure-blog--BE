import type { Request, Response } from "express";
import { prisma } from "@/lib/prisma";

const getPublishedPosts = async (_req: Request, res: Response) => {
	const publishedPosts = await prisma.post.findMany({
		where: {
			isPublished: true,
		},
	});

	res.json(publishedPosts);
};

const getPost = async (req: Request, res: Response) => {
	const { postId } = req.params;
	const post = await prisma.post.findUnique({
		where: {
			id: String(postId),
		},
	});

	if (!post) return res.status(404).json({ error: "Post does not exist" });
	// TODO: after auth setup, if unpublished, only that author can see the post.

	res.json(post);
};

export { getPublishedPosts, getPost };
