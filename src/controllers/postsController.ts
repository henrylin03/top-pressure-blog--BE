import type { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { prisma } from "@/lib/prisma";
import { authenticateWithJwt, checkIsAuthor } from "@/middleware/auth";
import { checkPostExists } from "@/middleware/checkExists";
import validatePost from "@/middleware/validation/validatePost";
import type { AuthenticatedRequest } from "@/types/types";

const addNewDraftPost = [
	authenticateWithJwt,
	checkIsAuthor,
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const newDraftPost = await prisma.post.create({
				data: { authorId: String(req.user.id), isPublished: false },
			});
			res.status(201).json({ message: "New draft post created", newDraftPost });
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

const deletePost = [
	authenticateWithJwt,
	checkIsAuthor,
	checkPostExists,
	async (req: AuthenticatedRequest, res: Response) => {
		const { id: userId } = req.user;
		const { postId } = req.params;

		const post = await prisma.post.findUnique({
			where: { id: String(postId) },
		});

		if (post?.authorId !== userId)
			return res.status(403).json({
				error: "InsufficientPermissions",
				message: "Only the author of a post can delete the post",
			});

		try {
			const _postForDeletion = await prisma.post.delete({
				where: { id: String(req.params.postId) },
			});
			res.status(204).end();
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

const editPost = [
	authenticateWithJwt,
	checkIsAuthor,
	checkPostExists,
	validatePost,
	async (req: AuthenticatedRequest, res: Response) => {
		const data = matchedData(req, { onlyValidData: false });
		const { title, text } = data;

		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array(), title, text });

		const { postId } = req.params;
		const post = await prisma.post.findUnique({
			where: { id: String(postId) },
		});

		if (String(post?.authorId) !== String(req.user.id))
			return res.status(403).json({
				error: "InsufficientPermissions",
				message: "Only the author of a post can edit it",
			});

		try {
			const updatedPost = await prisma.post.update({
				where: { id: String(postId) },
				data: {
					title,
					text,
					authorId: req.user.id,
					lastModifiedAt: new Date(),
				},
			});
			res.status(200).json({ message: "Post updated", updatedPost });
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

const getPublishedPosts = async (_req: Request, res: Response) => {
	const publishedPosts = await prisma.post.findMany({
		where: {
			isPublished: true,
		},
	});
	res.status(200).json({ posts: publishedPosts });
};

const getPost = [
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const post = await prisma.post.findUnique({
				where: { id: String(req.params.postId) },
			});
			if (!post) return res.status(404).json({ error: "Post does not exist" });
			if (post.isPublished && post.publishedAt) res.status(200).json({ post });

			req.post = post;

			next();
		} catch (error) {
			res.status(500).json({ error });
		}
	},
	authenticateWithJwt,
	checkIsAuthor,
	(req: AuthenticatedRequest, res: Response) => {
		res.send("hello");
	},
];

export { addNewDraftPost, deletePost, editPost, getPost, getPublishedPosts };
