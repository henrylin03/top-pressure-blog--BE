import express from "express";
import authRouter from "./routes/auth";
import postsRouter from "./routes/posts";
import usersRouter from "./routes/users";
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
