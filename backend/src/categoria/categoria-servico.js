import { pool } from "../db.js";

export const CategoryService = {
	async getCategoriasPorProjeto(projeto_id) {
		try {
			const data = await pool.query(
				`SELECT * FROM colunas WHERE projeto_id = '${projeto_id}'
				ORDER BY
					ordem ASC;
				`
			);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
	async insertCategoria(categoria) {
		try {
			const query = `INSERT INTO colunas (projeto_id, data_criacao, nome, ordem) VALUES ($1, CURRENT_TIMESTAMP, $2, $3) RETURNING id`;
			const values = [
				categoria.projeto_id,
				categoria.nome,
				categoria.ordem,
			];
			const data = await pool.query(query, values);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
	async updateCategoria(id, categoria) {
		try {
			const query = `UPDATE colunas SET projeto_id = ($1), nome = ($2), ordem = ($3)  WHERE id = ($4);`;
			const values = [
				categoria.projeto_id,
				categoria.nome,
				categoria.ordem,
				id,
			];
			const data = await pool.query(query, values);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
	async deleteCategoria(id) {
		try {
			const data = await pool.query(
				`
				DELETE FROM tarefas WHERE coluna_id = ${id};
				DELETE FROM colunas WHERE id = ${id};
				`
			);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
};
