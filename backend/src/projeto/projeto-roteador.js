import express from "express";
import { ProjectService } from "./projeto-servico.js";

const jsonBodyParser = express.json();
const ProjectRouter = express.Router();

ProjectRouter.route("/").post(jsonBodyParser, async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ Error: `Missing request body` });
	}

	for (let prop of ["nome"]) {
		if (req.body[prop] === undefined) {
			return res
				.status(400)
				.json({ Error: `Missing '${prop}' property on request body` });
		}
	}

	const { nome, adm } = req.body;

	const projeto = {
		nome: nome,
		adm: adm,
	};

	const dbRes = await ProjectService.insertProjeto(projeto);

	if (dbRes) {
		res.status(201).json(dbRes);
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

ProjectRouter.route("/")
	.patch(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		for (let prop of ["nome"]) {
			if (req.body[prop] === undefined) {
				return res.status(400).json({
					Error: `Missing '${prop}' property on request body`,
				});
			}
		}

		const { nome, id } = req.body;

		const projeto = {
			nome: nome,
		};

		const dbRes = await ProjectService.updateProjeto(id, projeto);

		if (dbRes) {
			res.status(201).json(dbRes);
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	})

	.delete(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		const { id } = req.body;

		const dbRes = await ProjectService.deleteProjeto(id);

		if (dbRes) {
			res.status(201).json(dbRes);
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	});

ProjectRouter.route("/:id").get(jsonBodyParser, async (req, res) => {
	if (!req.params)
		return res.status(400).json({ error: "Missing Req Params" });
	const { id } = req.params;

	const dbRes = await ProjectService.getProjetosPorId(id);
	console.log(dbRes);
	if (dbRes.id) {
		res.status(200).json(dbRes);
	} else {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

ProjectRouter.route("/membros").post(jsonBodyParser, async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ Error: `Missing request body` });
	}

	for (let prop of ["email", "projeto_id"]) {
		if (req.body[prop] === undefined) {
			return res.status(400).json({
				Error: `Missing '${prop}' property on request body`,
			});
		}
	}
	const { email, projeto_id } = req.body;

	const dbRes = await ProjectService.insertUsuarioProjeto(email, projeto_id);
	if (dbRes) {
		res.status(201).json({
			result: "Usuario adicionado ao projeto com sucesso!",
		});
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

export default ProjectRouter;
