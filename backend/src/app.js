import TaskRouter from "./tarefa/tarefa-roteador.js";
import express from "express";
import cors from "cors";
import CategoryRouter from "./categoria/categoria-roteador.js"
import ProjectRouter from "./categoria/projeto-roteador.js"
import TaskRouter from "./categoria/tarefa-roteador.js"

export const app = express();

app.use("/api/categoria", CategoryRouter);
app.use("/api/projeto", ProjectRouter);
app.use("/api/tarefa", TaskRouter);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/tarefa", TaskRouter);