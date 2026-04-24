import express from "express";
import usersRouter from "@/routes/v1/users.js";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/users", usersRouter);
