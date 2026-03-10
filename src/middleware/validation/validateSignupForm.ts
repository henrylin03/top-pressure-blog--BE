import { body } from "express-validator";
import { prisma } from "@/lib/prisma";

const validateSignupForm = [
	body("email")
		.trim()
		.isEmail()
		.withMessage("Enter a valid email address")
		.isLength({ max: 256 })
		.withMessage("Email address must be max 256 characters")
		.custom(async (input) => {
			const user = await prisma.user.findUnique({
				where: {
					email: input,
				},
			});

			if (user) throw new Error("Email is already in use");
		}),

	body("username")
		.trim()
		.isAlphanumeric("en-AU", { ignore: "-_" })
		.withMessage("Username must only contain letters, hyphens and underscores")
		.isLength({ min: 3, max: 30 })
		.withMessage("Username must be between 3 and 30 characters")
		.custom(async (input) => {
			const user = await prisma.user.findUnique({
				where: {
					username: input,
				},
			});

			if (user) throw new Error("Username is already in use");
		}),

	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be longer than 8 characters"),
];

export default validateSignupForm;
