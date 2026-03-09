import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "./prisma";

const OPTIONS = {
	usernameField: "email",
	session: false,
};

passport.use(
	new LocalStrategy(OPTIONS, async (username, password, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { email: username } });
			if (!user) return done(null, false);

			const isMatchedPassword = await bcrypt.compare(password, user.password);
			if (!isMatchedPassword) return done(null, false);

			return done(null, user);
		} catch (error) {
			done(error);
		}
	}),
);

export default passport;
