import express from "express";
import postsRouter from "./routers/postsRouter";
import usersRouter from "./routers/usersRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

const PORT = 6969;
app.listen(PORT, (err) => {
	if (err) throw Error;
	console.log(`Listening on port ${PORT}`);
});
