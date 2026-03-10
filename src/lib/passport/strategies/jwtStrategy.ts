import { prisma } from "@/lib/prisma";
import "dotenv/config";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

const OPTIONS = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: String(process.env.SECRET),
};

const jwtStrategy = new JwtStrategy(OPTIONS, async (payload, done) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: payload.sub },
		});
		if (user) return done(null, user);
		else return done(null, false);
	} catch (error) {
		done(error);
	}
});

export default jwtStrategy;
