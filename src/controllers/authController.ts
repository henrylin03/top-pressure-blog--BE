import type { Request, Response } from "express";
import passport from "@/lib/passport";

const loginPost = [
	passport.authenticate("local", { session: false }),
	(req: Request, res: Response) => res.json(req.user),
];

export { loginPost };
