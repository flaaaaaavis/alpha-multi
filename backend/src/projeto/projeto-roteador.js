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
			res.status(201).json({ result: "Projeto alterado com sucesso" });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	})

	.delete(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		const { id, adm } = req.body;

		const dbRes = await ProjectService.deleteProjeto(id, adm);

		if (dbRes == "not adm") {
			res.status(400).json(dbRes);
		} else if (dbRes) {
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
	console.log("89", dbRes);
	if (dbRes == undefined) {
		res.status(400).json({ erro: 400 });
	} else if (dbRes.id) {
		res.status(200).json(dbRes);
	} else {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

ProjectRouter.route("/membros")
	.post(jsonBodyParser, async (req, res) => {
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

		const dbRes = await ProjectService.insertUsuarioProjeto(
			email,
			projeto_id
		);
		if (dbRes == "existe") {
			res.status(400).json({
				erro: "Usuario já está no projeto",
			});
		} else if (dbRes) {
			res.status(201).json({
				result: "Usuario adicionado ao projeto com sucesso!",
			});
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	})
	.delete(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		const { usuario_id, projeto_id } = req.body;

		const dbRes = await ProjectService.deleteUsuarioProjeto(
			usuario_id,
			projeto_id
		);
		console.log(dbRes);
		if (dbRes) {
			res.status(201).json({ mensagem: "Membro removido com sucesso" });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	});

ProjectRouter.route("/usuarios").post(jsonBodyParser, async (req, res) => {
	if (!req.body)
		return res.status(400).json({ error: `Missing request body` });

	const { id } = req.body;

	const projetos = await ProjectService.getUsuarioPorProjeto(id);
	if (!projetos) return res.status(200).json({ error: "Nenhum usuário" });
	if (projetos.length > 0)
		return res.status(200).json({ projetos: projetos });
	res.status(500).json({ error: "Internal Server Error" });
});

export default ProjectRouter;
