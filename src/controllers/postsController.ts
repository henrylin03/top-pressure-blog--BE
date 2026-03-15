import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { calculateTimeToReadInMinutes } from "@/helpers/helpers";
import { prisma } from "@/lib/prisma";
import { attachDraftPostAndReturnPublishedPost } from "@/middleware/attach";
import { authenticateWithJwt } from "@/middleware/auth";
import validatePost from "@/middleware/validation/validatePost";
import type { AuthenticatedRequest } from "@/types/types";

const addNewDraftPost = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const newDraftPost = await prisma.post.create({
			data: { authorId: String(req.user.id), isPublished: false },
		});
		res.status(201).json({ message: "New draft post created", newDraftPost });
	} catch (error) {
		res.status(500).json({ error });
	}
};

const deletePost = async (req: AuthenticatedRequest, res: Response) => {
	const { post } = req;
	const { id: userId } = req.user;

	if (post?.authorId !== userId)
		return res.status(403).json({
			error: "InsufficientPermissions",
			message: "Only the author of a post can delete the post",
		});

	try {
		const deleteComments = prisma.comment.deleteMany({
			where: { postId: post.id },
		});
		const deletePost = prisma.post.delete({ where: { id: post.id } });

		const _transaction = await prisma.$transaction([
			deleteComments,
			deletePost,
		]);

		res.status(204).end();
	} catch (error) {
		res.status(500).json({ error });
	}
};

const editPost = [
	validatePost,
	async (req: AuthenticatedRequest, res: Response) => {
		const data = matchedData(req, { onlyValidData: false });
		const { title, text } = data;

		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array(), title, text });

		const { post } = req;
		if (String(post?.authorId) !== req.user.id)
			return res.status(403).json({
				error: "InsufficientPermissions",
				message: "Only the author of a post can edit it",
			});

		try {
			const updatedPost = await prisma.post.update({
				where: { id: String(post?.id) },
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
	attachDraftPostAndReturnPublishedPost,
	authenticateWithJwt,
	(req: AuthenticatedRequest, res: Response) => {
		const { user, post } = req;
		if (!user.isAuthor)
			return res.status(404).json({ error: "Post not found" });

		if (String(post?.authorId) !== req.user.id)
			return res
				.status(403)
				.json({ error: "Only author of post can access it" });

		res.status(200).json({ post });
	},
];

const publishPost = async (req: AuthenticatedRequest, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).json({ errors: errors.array() });

	const { post } = req;
	if (req.user.id !== post?.authorId)
		return res
			.status(403)
			.json({ error: "Only the author of this post can modify it" });

	if (post.isPublished)
		return res.status(200).json({ message: "Post already published", post });

	const currentDatetime = new Date();
	const updatePost = await prisma.post.update({
		where: { id: post.id },
		data: {
			isPublished: true,
			publishedAt: currentDatetime,
			lastModifiedAt: currentDatetime,
			timeToReadInMinutes: calculateTimeToReadInMinutes(
				`${post.lede} ${post.text}`,
			),
		},
	});

	res.status(200).json({ message: "Post published", post: updatePost });
};

const unpublishPost = async (req: AuthenticatedRequest, res: Response) => {
	const { post } = req;

	if (req.user.id !== String(post?.authorId))
		return res
			.status(403)
			.json({ error: "Only the author of this post can modify it" });

	if (!post?.isPublished)
		return res.status(200).json({ message: "Post already in draft", post });

	const updatePost = await prisma.post.update({
		where: { id: post.id },
		data: {
			isPublished: false,
			publishedAt: null,
			lastModifiedAt: new Date(),
		},
	});

	res.status(200).json({ message: "Post marked as draft", post: updatePost });
};

export {
	addNewDraftPost,
	deletePost,
	editPost,
	getPost,
	getPublishedPosts,
	publishPost,
	unpublishPost,
};
