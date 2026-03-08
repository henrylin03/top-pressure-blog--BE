import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => res.json("hello world"));

const PORT = 3000;
app.listen(PORT, (err) => {
	if (err) throw Error;
	console.log(`Listening on port ${PORT}`);
});
