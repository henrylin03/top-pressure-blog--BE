import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { prisma } from "@/lib/prisma";
import {
	authenticateWithJwt,
	confirmUserIsAuthorised,
} from "@/middleware/auth";
import { checkPostExists } from "@/middleware/checkExists";
import validatePost from "@/middleware/validation/validatePost";
import type { AuthenticatedRequest } from "@/types/types";

const addNewDraftPost = [
	authenticateWithJwt,
	confirmUserIsAuthorised,
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
	confirmUserIsAuthorised,
	checkPostExists,
	async (req: AuthenticatedRequest, res: Response) => {
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
	confirmUserIsAuthorised,
	validatePost,
	async (req: AuthenticatedRequest, res: Response) => {
		const data = matchedData(req, { onlyValidData: false });
		const { title, text } = data;

		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array(), title, text });

		const { postId } = req.params;
		const { id: authorId } = req.user;

		try {
			const post = await prisma.post.findUnique({
				where: { id: String(postId) },
			});
			if (!post) return res.status(404).json({ error: "Post not found" });
			const updatedPost = await prisma.post.update({
				where: { id: String(postId) },
				data: { title, text, authorId, lastModifiedAt: new Date() },
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

export { addNewDraftPost, deletePost, editPost, getPost, getPublishedPosts };
