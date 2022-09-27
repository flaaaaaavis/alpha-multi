import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { redis } from "../redis.js";

export const ProjectService = {
	async getProjetosPorId(projeto_id) {
		try {
			const projetos = await redis.hgetall(`projeto:${projeto_id}`);
			if (projetos.id && projetos.deletado != "true") {
				console.log("entrou no cache", projetos);
				return projetos;
			}
			console.log("entrou no pg");
			const data = await pool.query(
				`SELECT * FROM projetos WHERE id = '${projeto_id}' AND deletado IS NOT TRUE`
			);
			if (data.rows[0]) {
				await redis.hmset(`projeto:${projeto_id}`, data.rows[0]);
				await redis.expire(`projeto:${projeto_id}`, 60 * 60 * 24);
			}
			return data.rows[0];
		} catch (e) {
			console.log(e);
		}
	},
	async insertUsuarioProjeto(email, projeto_id) {
		try {
			const query = `SELECT id FROM usuarios WHERE email = '${email}'`;
			const data = await pool.query(query);
			const usuario_id = data.rows[0].id;
			const query2 = `SELECT * FROM projetos_usuarios WHERE usuario_id = $1 AND projeto_id = $2`;
			const values2 = [usuario_id, projeto_id];
			const data2 = await pool.query(query2, values2);
			if (data2.rows[0]) {
				console.log(data2.rows);
				return "existe";
			}
			const query3 = `INSERT INTO projetos_usuarios (usuario_id, projeto_id) VALUES ($1, $2)`;
			const values3 = [usuario_id, projeto_id];
			const data3 = await pool.query(query3, values3);
			return data3;
		} catch (e) {
			console.log(e);
		}
	},
	async insertProjeto(projeto) {
		try {
			const id = uuidv4();
			const query = `INSERT INTO projetos (id, nome, adm, data_criacao, ultimo_acesso, deletado) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false) RETURNING *`;
			const values = [id, projeto.nome, projeto.adm];
			const data = await pool.query(query, values);
			await redis.hmset(`projeto:${id}`, data.rows[0]);
			await redis.expire(`projeto:${id}`, 60 * 60 * 24);
			const query2 = `INSERT INTO projetos_usuarios (usuario_id, projeto_id) VALUES ($1, $2)`;
			const values2 = [projeto.adm, id];
			const data2 = await pool.query(query2, values2);
			return id;
		} catch (e) {
			console.log(e);
		}
	},
	async updateProjeto(id, projeto) {
		try {
			await redis.hset(`projeto:${id}`, "nome", projeto.nome);
			await redis.expire(`projeto:${id}`, 60 * 60 * 24);
			const projetos = await redis.hgetall(`projeto:${id}`);
			console.log("redis update", projetos);
			const query = `UPDATE projetos SET nome = ($1), ultimo_acesso = (CURRENT_TIMESTAMP)  WHERE id = ($2);`;
			const values = [projeto.nome, id];
			const data = await pool.query(query, values);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
	async deleteProjeto(id, adm) {
		try {
			const data = await pool.query(
				`UPDATE projetos SET deletado = TRUE WHERE id = '${id}' AND adm = '${adm}' RETURNING id`
			);
			console.log("data", data.rows[0]);
			if (data.rows[0] != undefined) {
				console.log("excluindo");
				await redis.hset(`projeto:${id}`, "deletado", true);
				const projetos = await redis.hgetall(`projeto:${id}`);
				console.log("redis delete", projetos);
				console.log("pg delete", data.rows);
				return data.rows;
			}
			return "not adm";
		} catch (e) {
			console.log(e);
		}
	},

	async deleteUsuarioProjeto(usuario_id, projeto_id) {
		try {
			console.log("99", usuario_id, projeto_id);
			const data = await pool.query(
				`DELETE FROM projetos_usuarios WHERE usuario_id = '${usuario_id}' AND projeto_id = '${projeto_id}'`
			);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
	async getUsuarioPorProjeto(id) {
		try {
			console.log(id);
			const projeto = await pool.query(
				`SELECT usuario_id FROM projetos_usuarios WHERE projeto_id = '${id}'`
			);
			if (projeto.rowCount < 1) {
				return false;
			} else {
				return projeto.rows;
			}
		} catch (e) {
			console.log("Testando");
			console.log(e);
		}
	},
};
