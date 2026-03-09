import express from "express";
import postsRouter from "./routers/postsRouter";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/posts", postsRouter);

const PORT = 6969;
app.listen(PORT, (err) => {
	if (err) throw Error;
	console.log(`Listening on port ${PORT}`);
});
