import "dotenv/config";
import passport from "@/lib/passport";
import createJwt from "@/middleware/createJwt";

const loginPost = [
	passport.authenticate("local", { session: false }),
	createJwt,
];

const authenticateWithJwt = passport.authenticate("jwt", { session: false });

export { authenticateWithJwt, loginPost };
