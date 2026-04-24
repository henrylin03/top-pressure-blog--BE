import { expect, test } from "@jest/globals";
import express from "express";
import usersRouter from "@/routes/v1/users.js";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/users", usersRouter);

test("User can sign-up", (done) => {});
