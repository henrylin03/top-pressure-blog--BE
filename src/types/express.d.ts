import type { Comment, Post } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			post?: Post;
			comment?: Comment;
		}
		interface User {
			id: string;
			isAuthor: boolean;
		}
	}
}
