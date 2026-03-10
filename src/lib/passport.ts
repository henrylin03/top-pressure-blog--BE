import bcrypt from "bcryptjs";
import passport from "passport";
import {
	type IStrategyOptions,
	Strategy as LocalStrategy,
} from "passport-local";
import { prisma } from "./prisma";

const LOCAL_STRATEGY_OPTIONS: IStrategyOptions = {
	usernameField: "usernameOrEmail",
	session: false,
};

passport.use(
	new LocalStrategy(
		LOCAL_STRATEGY_OPTIONS,
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
	),
);

export default passport;
