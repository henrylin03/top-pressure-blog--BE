import express from "express";
import authRouter from "./routers/authRouter";
import postsRouter from "./routers/postsRouter";
import usersRouter from "./routers/usersRouter";
import "dotenv/config";

if (!process.env.SECRET) {
	throw new Error("SECRET variable missing in dotenv file.");
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

const PORT = 6969;
app.listen(PORT, (err) => {
	if (err) throw Error;
	console.log(`Listening on port ${PORT}`);
});
