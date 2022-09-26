import express from "express";
import { TaskService } from "./tarefa-servico.js";

const jsonBodyParser = express.json();
const TaskRouter = express.Router();

TaskRouter.route("/")
	.post(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		for (let prop of ["coluna_id", "nome", "ordem", "tags"]) {
			if (req.body[prop] === undefined) {
				return res.status(400).json({
					Error: `Missing '${prop}' property on request body`,
				});
			}
		}

		const { coluna_id, nome, ordem, tags, anotacoes, colaboradores } =
			req.body;

		const tarefa = {
			coluna_id: coluna_id,
			nome: nome,
			ordem: parseInt(ordem),
			tags: tags,
			anotacoes: anotacoes || "",
			colaboradores: colaboradores || "[]",
		};
		const dbRes = await TaskService.insertTarefa(tarefa);

		if (dbRes.rowCount === 1) {
			res.status(201).json({
				result: "Tarefa criada com sucesso!",
				id: dbRes.rows[0].id,
			});
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	})

	.patch(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		for (let prop of ["coluna_id", "nome", "ordem", "tags"]) {
			if (req.body[prop] === undefined) {
				return res.status(400).json({
					Error: `Missing '${prop}' property on request body`,
				});
			}
		}

		const { coluna_id, nome, ordem, tags, anotacoes, colaboradores, id } =
			req.body;

		const tarefa = {
			coluna_id: coluna_id,
			nome: nome,
			ordem: parseInt(ordem),
			tags: tags,
			anotacoes: anotacoes,
			colaboradores: colaboradores,
		};

		const dbRes = await TaskService.updateTarefa(id, tarefa);

		if (dbRes) {
			res.status(200).json({ result: "Tarefa alterada com sucesso!" });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	})

	.delete(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		const { id } = req.body;

		const dbRes = await TaskService.deleteTarefa(id);

		if (dbRes) {
			res.status(200).json({ result: "Tarefa deletada com sucesso!" });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	});

TaskRouter.route("/:id_categoria").get(jsonBodyParser, async (req, res) => {
	if (!req.params) {
		return res.status(400).json({ error: "Missing request params" });
	}

	const { id_categoria } = req.params;

	const dbRes = await TaskService.getTarefasPorColuna(id_categoria);
	if (dbRes.length >= 1) return res.status(200).json(dbRes);
	if (!dbRes.rows) return res.status(200).json({ erro: "Nenhuma tarefa" });
	return res.status(500).json({ message: "Internal Server Error" });
});

export default TaskRouter;
