import express from "express";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { hashPwd, comparePwd } from "../hashPwd.js";
import { UserService } from "./usuario-servico.js";

const jsonBodyParser = express.json();
const UserRouter = express.Router();

UserRouter.route("/")
	.post(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ error: `Missing request body` });
		}

		for (let prop of ["usuario", "email", "senha"]) {
			if (req.body[prop] === undefined) {
				return res.status(400).json({
					error: `Missing '${prop}' property on request body`,
				});
			}
		}

		const { usuario, email, senha } = req.body;

		const novoUsuario = {
			usuario: usuario,
			email: email,
			senha: senha,
		};

		const dbRes = await UserService.insertUsuario(novoUsuario);

		if (dbRes.rowCount === 1) {
			res.status(200).json({ result: "Usuario criado com sucesso!" });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	})

	.patch(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ error: `Missing request body` });
		}

		for (let prop of ["email", "usuario"]) {
			if (req.body[prop] === undefined) {
				return res.status(400).json({
					error: `Missing '${prop}' property on request body`,
				});
			}
		}

		const { id, email, usuario } = req.body;

		const novoUsuario = {
			email: email,
			usuario: usuario,
		};

		const dbRes = await UserService.updateUsuario(id, novoUsuario);

		if (dbRes.rowCount === 1) {
			res.status(200).json({ result: "Usuario alterado com sucesso!" });
		} else {
			res.status(500).json({ error: "Internal Server Error" });
		}
	})

	.delete(jsonBodyParser, async (req, res) => {
		if (!req.body) {
			return res.status(400).json({ error: `Missing request body` });
		}

		const { id } = req.body;

		const dbRes = await UserService.deleteUsuario(id);

		if (dbRes.rowCount === 1) {
			res.status(200).json({ result: "Usuário deletado com sucesso!" });
		} else {
			res.status(500).json({ error: "Internal Server Error" });
		}
	});

UserRouter.route("/:id").get(jsonBodyParser, async (req, res) => {
	if (!req.params)
		return res.status(400).json({ error: "Missing Req Params" });
	const { id } = req.params;

	const dbRes = await UserService.getUsuario(id);

	if (dbRes.id) {
		res.status(200).json(dbRes);
	} else {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

UserRouter.route("/email/:email").get(jsonBodyParser, async (req, res) => {
	if (!req.params)
		return res.status(400).json({ error: "Missing Req Params" });
	const { email } = req.params;

	const dbRes = await UserService.getUsuarioByEmail(email);

	if (dbRes.id) {
		res.status(200).json(dbRes);
	} else {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

UserRouter.route("/senha").patch(jsonBodyParser, async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ error: `Missing request body` });
	}

	if (req.body[("id", "senha")] === undefined) {
		return res
			.status(400)
			.json({ error: `Missing 'senha' property on request body` });
	}

	const { id, senha } = req.body;

	const novaSenha = hashPwd(senha);

	const dbRes = await UserService.updateUsuarioSenha(id, novaSenha);
	console.log("senha", dbRes.rowCount);
	if (dbRes.rowCount === 1) {
		res.status(200).json({ result: "Senha alterada!" });
	} else {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

UserRouter.route("/login").post(jsonBodyParser, async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ error: `Missing request body` });
	}

	for (let prop of ["email", "senha"]) {
		if (req.body[prop] === undefined) {
			return res
				.status(400)
				.json({ error: `Missing '${prop}' property on request body` });
		}
	}

	const { email, senha } = req.body;

	const usuario = await UserService.getUsuarioByEmail(email);
	if (!usuario) {
		return res.status(400).json({ error: `Email inválido` });
	}
	console.log(usuario);
	if (comparePwd(senha, usuario.senha)) {
		const token = jwt.sign({ usuario: usuario }, config.API_KEY);

		return res.json({ auth: true, token });
	} else {
		return res.status(400).json({ error: `Senha inválida` });
	}
});

UserRouter.route("/projetos").post(jsonBodyParser, async (req, res) => {
	if (!req.body)
		return res.status(400).json({ error: `Missing request body` });

	const { id } = req.body;

	const projetos = await UserService.getProjetosPorUsuario(id);

	if (!projetos) return res.status(200).json({ error: "Nenhum projeto" });
	if (projetos.length > 0)
		return res.status(200).json({ projetos: projetos });
	res.status(500).json({ error: "Internal Server Error" });
});

export default UserRouter;
