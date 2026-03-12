import type { Post } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			post?: Post;
		}
		interface User {
			id: string;
			isAuthor: boolean;
		}
	}
}
