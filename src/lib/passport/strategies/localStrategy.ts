import bcrypt from "bcryptjs";
import {
	type IStrategyOptions,
	Strategy as LocalStrategy,
} from "passport-local";
import { prisma } from "@/lib/prisma.js";

const OPTIONS: IStrategyOptions = {
	usernameField: "usernameOrEmail",
	session: false,
};

const localStrategy = new LocalStrategy(
	OPTIONS,
	async (username, password, done) => {
		try {
			const user = await prisma.user.findFirst({
				where: { OR: [{ email: username }, { username }] },
			});
			if (!user) return done(null, false);

			const isMatchedPassword = await bcrypt.compare(password, user.password);
			if (!isMatchedPassword) return done(null, false);

			return done(null, user);
		} catch (error) {
			done(error);
		}
	},
);

export default localStrategy;
