import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { prisma } from "@/lib/prisma";
import { authenticateWithJwt, checkIsAuthor } from "@/middleware/auth";
import validateSignupForm from "@/middleware/validation/validateSignupForm";
import type { AuthenticatedRequest } from "@/types/types";

const newUserPost = [
	validateSignupForm,
	async (req: Request, res: Response) => {
		const formData = matchedData(req, { onlyValidData: false });
		const { email, username } = formData;

		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array(), email, username });

		const { password } = formData;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		try {
			const newUser = await prisma.user.create({
				data: { email, username, password: hashedPassword },
			});
			const userDetails = { email: newUser.email, username: newUser.username };
			res.status(201).json(userDetails);
		} catch (err) {
			res.status(500).json({ error: err });
		}
	},
];

const getMyPosts = [
	authenticateWithJwt,
	checkIsAuthor,
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const myPosts = await prisma.post.findMany({
				where: { authorId: req.user.id },
			});
			res.status(200).json({ posts: myPosts });
		} catch (error) {
			res.status(500).json({ error });
		}
	},
];

export { getMyPosts, newUserPost };
