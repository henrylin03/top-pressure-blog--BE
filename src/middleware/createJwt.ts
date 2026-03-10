import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const createJwt = (req: Request, res: Response) => {
	const { user } = req;
	if (!user) return res.status(401).json({ error: "Auth failed" });

	const JWT_EXPIRATION_IN_MS = 120; // 2mins
	const secret = process.env.SECRET;

	const token = jwt.sign({ sub: user.id }, String(secret), {
		expiresIn: JWT_EXPIRATION_IN_MS,
	});

	return res.status(200).json({ message: "Auth ok", token });
};

export default createJwt;
