import express from "express";
import { CategoryService } from "./categoria-servico.js";

const jsonBodyParser = express.json();
const CategoryRouter = express.Router();

CategoryRouter.route("/").post(jsonBodyParser, async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ Error: `Missing request body` });
	}

	for (let prop of ["projeto_id", "nome", "ordem"]) {
		if (req.body[prop] === undefined) {
			return res
				.status(400)
				.json({ Error: `Missing '${prop}' property on request body` });
		}
	}

	const { projeto_id, nome, ordem } = req.body;

	const categoria = {
		projeto_id: projeto_id,
		nome: nome,
		ordem: parseInt(ordem),
	};

	const dbRes = await CategoryService.insertCategoria(categoria);

	if (dbRes) {
		res.status(201).json(dbRes);
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

CategoryRouter.route("/:category_uuid")
	.patch(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ Error: `Missing request body` });
		}

		for (let prop of ["projeto_id", "nome", "ordem"]) {
			if (req.body[prop] === undefined) {
				return res.status(400).json({
					Error: `Missing '${prop}' property on request body`,
				});
			}
		}

		const { projeto_id, nome, ordem, id } = req.body;

		const categoria = {
			projeto_id: projeto_id,
			nome: nome,
			ordem: parseInt(ordem),
		};

		const dbRes = await CategoryService.updateCategoria(id, categoria);

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
		console.log(id);

		const dbRes = await CategoryService.deleteCategoria(id);
		console.log("76", dbRes);
		if (dbRes) {
			res.status(201).json(dbRes);
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	});

CategoryRouter.route("/:id").get(jsonBodyParser, async (req, res) => {
	if (!req.params)
		return res.status(400).json({ error: "Missing Req Params" });
	const { id } = req.params;

	const dbRes = await CategoryService.getCategoriasPorProjeto(id);
	if (dbRes) {
		res.status(200).json(dbRes);
	} else {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default CategoryRouter;
