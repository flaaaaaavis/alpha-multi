import TaskRouter from "./tarefa/tarefa-roteador.js";
import CategoryRouter from "./categoria/categoria-roteador.js";
import ProjectRouter from "./projeto/projeto-roteador.js";
import UserRouter from "./usuario/usuario-roteador.js";
import express from "express";
import cors from "cors";

export const app = express();

app.use(cors());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/categoria", CategoryRouter);
app.use("/api/projeto", ProjectRouter);
app.use("/api/tarefa", TaskRouter);
app.use("/api/usuario", UserRouter);
