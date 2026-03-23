import "dotenv/config";
import type { Response } from "express";
import passport from "@/lib/passport/index.js";
import { authenticateWithJwt } from "@/middleware/auth.js";
import { createJwt } from "@/middleware/jwt.js";
import type { AuthenticatedRequest } from "@/types/types.ts";

const loginPost = [
	passport.authenticate("local", { session: false }),
	createJwt,
];

const validateJwtGet = [
	authenticateWithJwt,
	async (req: AuthenticatedRequest, res: Response) => {
		const { password, ...otherUserDetails } = req.user;
		res
			.status(200)
			.json({ message: "JWT validated", user: { ...otherUserDetails } });
	},
];

export { loginPost, validateJwtGet };
