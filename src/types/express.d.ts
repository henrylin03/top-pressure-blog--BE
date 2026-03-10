declare global {
	namespace Express {
		interface User {
			id: string;
			isAuthor: boolean;
		}
	}
}

export {};
