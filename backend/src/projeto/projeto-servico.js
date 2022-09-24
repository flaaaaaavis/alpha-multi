import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const ProjectService = {
	async getProjetosPorId(projeto_id) {
		try {
			const data = await pool.query(
				`SELECT * FROM projetos WHERE id = '${projeto_id}' AND deletado IS NOT TRUE`
			);
			console.log(data.rows);
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
			const query = `INSERT INTO projetos (id, nome, adm, data_criacao, ultimo_acesso) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
			const values = [id, projeto.nome, projeto.adm];
			await pool.query(query, values);
			const query2 = `INSERT INTO projetos_usuarios (usuario_id, projeto_id) VALUES ($1, $2)`;
			const values2 = [projeto.adm, id];
			const data = await pool.query(query2, values2);
			return id;
		} catch (e) {
			console.log(e);
		}
	},
	async updateProjeto(id, projeto) {
		try {
			const query = `UPDATE projetos SET nome = ($1), ultimo_acesso = (CURRENT_TIMESTAMP)  WHERE id = ($2);`;
			const values = [projeto.nome, id];
			const data = await pool.query(query, values);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
	async deleteProjeto(id) {
		try {
			const data = await pool.query(
				"UPDATE projetos SET deletado = TRUE WHERE id = '" + id + "'"
			);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},

	async deleteUsuarioProjeto(usuario_id, projeto_id) {
		try {
			const data = await pool.query(
				`DELETE FROM projetos_usuarios WHERE usuario_id = ${usuario_id} AND projeto_id = ${projeto_id} LIMIT 1`
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
