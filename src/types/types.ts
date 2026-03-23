import type { User } from "@prisma/client.js";
import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
	user: User;
}
