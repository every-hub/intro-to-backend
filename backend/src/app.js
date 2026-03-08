import express from "express";

const app = express(); //create an express app

app.use(express.json());

import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter);

// http://localhost:4000/api/v1/users/register

export default app;