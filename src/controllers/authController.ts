import type { Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import passport from "@/lib/passport";

const createJwt = (req: Request, res: Response) => {
	const { user } = req;
	if (!user) return res.status(401).json({ error: "Authentication failed" });

	const JWT_EXPIRATION_IN_MS = 120; // 2mins
	const secret = process.env.SECRET;

	const token = jwt.sign({ user: { id: user.id } }, String(secret), {
		expiresIn: JWT_EXPIRATION_IN_MS,
	});

	return res.status(200).json({ message: "Auth ok", token });
};

const loginPost = [
	passport.authenticate("local", { session: false }),
	createJwt,
];

export { loginPost };
