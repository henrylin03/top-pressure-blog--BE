import type { NextFunction, Request, Response } from "express";
import passport from "@/lib/passport";

export const authenticateWithJwt = passport.authenticate("jwt", {
	session: false,
});

export const checkIsAuthor = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { user } = req;
	if (!user) return res.status(401).json({ error: "Unauthorised" });
	if (!user.isAuthor)
		return res.status(403).json({ error: "You must be an author to post" });
	next();
};
