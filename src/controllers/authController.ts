import type { Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

const loginPost = (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (email === "correct@email.com") {
		if (password === "Password") {
			const options = { expiresIn: 120 };
			const secret = process.env.SECRET;

			if (!process.env.SECRET)
				throw new Error(
					"Please ensure you have a 'SECRET' variable in .env for JWT",
				);

			const token = jwt.sign({ email }, String(secret), options);
			return res.status(200).json({ message: "Auth ok", token });
		}
	}
	res.status(401).json({ error: "Auth failed" });
};

export { loginPost };
