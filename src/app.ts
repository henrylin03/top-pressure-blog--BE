import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./routes";

if (!process.env.SECRET) {
	throw new Error("SECRET variable missing in dotenv file.");
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const PORT = 6969;
app.listen(PORT, (err) => {
	if (err) throw Error;
	console.log(`Listening on port ${PORT}`);
});
