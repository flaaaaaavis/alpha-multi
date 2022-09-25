import { pool } from "../db.js";

export const TaskService = {
	async getTarefasPorColuna(coluna_id) {
		try {
			const data = await pool.query(
				`SELECT * FROM tarefas WHERE coluna_id = ${coluna_id}
				ORDER BY
					ordem ASC;
				`
			);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
	async insertTarefa(tarefa) {
		try {
			const query = `INSERT INTO tarefas (coluna_id, data_criacao, nome, ordem, tags, anotacoes, colaboradores) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6) RETURNING id`;
			const values = [
				tarefa.coluna_id,
				tarefa.nome,
				tarefa.ordem,
				tarefa.tags,
				tarefa.anotacoes,
				tarefa.colaboradores,
			];
			const data = await pool.query(query, values);

			return data;
		} catch (e) {
			console.log(e);
		}
	},
	async updateTarefa(id, tarefa) {
		try {
			const query = `UPDATE tarefas SET coluna_id = ($1), nome = ($2), ordem = ($3), tags = ($4), anotacoes = ($5), colaboradores = ($6)  WHERE id = ($7);`;
			const values = [
				tarefa.coluna_id,
				tarefa.nome,
				tarefa.ordem,
				tarefa.tags,
				tarefa.anotacoes,
				tarefa.colaboradores,
				id,
			];
			const data = await pool.query(query, values);
			return data.rows;
		} catch (e) {
			console.log(e);
		}
	},
	async deleteTarefa(id) {
		try {
			const data = await pool.query(
				`DELETE FROM tarefas WHERE id = ${id}`
			);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
};
