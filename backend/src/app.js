import TaskRouter from "./tarefa/tarefa-roteador.js";
import config from "./config.js";
import express from "express";
import cors from "cors";

export const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/tarefa", TaskRouter);