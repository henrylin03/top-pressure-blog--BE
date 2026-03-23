import passport from "passport";
import jwtStrategy from "./strategies/jwtStrategy.js";
import localStrategy from "./strategies/localStrategy.js";

passport.use(localStrategy);
passport.use(jwtStrategy);

export default passport;
