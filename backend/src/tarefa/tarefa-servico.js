import { pool } from "../db";
import config from "../config";

export const TaskService = {
    async getTarefasPorColuna(coluna_id) {

        try {

            const data = await pool.query(`SELECT * FROM tarefas WHERE coluna_id = ${coluna_id}`)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async insertTarefa(tarefa) {

        try {

            const query = `INSERT INTO tarefas (coluna_id, data_criacao, nome, ordem, tags, anotacoes) VALUES ($1, CURRENT_TIMESTAMP, $3, $4, $5, $6)`;
            const values = [tarefa.coluna_id, tarefa.nome, tarefa.ordem, tarefa.tags, tarefa.anotacoes];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async updateTarefa(id, tarefa) {

        try {           

            const query = `UPDATE tarefas SET coluna_id = ($1), nome = ($2), ordem = ($3), tags = ($4), anotacoes = ($5)  WHERE id = ($6);`;
            const values = [tarefa.coluna_id, tarefa.nome, tarefa.ordem, tarefa.tags, tarefa.anotacoes, id];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }
        

    },
    async deleteTarefa(id) {

        try {

            const data = await pool.query(`DELETE FROM tarefas WHERE id = ${id}`)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
  };
  