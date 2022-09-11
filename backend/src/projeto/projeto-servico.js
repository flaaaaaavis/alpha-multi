import { pool } from "../db.js";
import config from "../config.js";

export const ProjectService = {
    async getProjetosPorId(projeto_id) {

        try {

            const data = await pool.query(`SELECT * FROM projetos WHERE id = ${projeto_id}`)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async insertProjeto(projeto) {

        try {

            const query = `INSERT INTO projetos (nome, data_criacao, ultimo_acesso) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
            const values = [projeto.nome];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async updateProjeto(id, projeto) {

        try {           

            const query = `UPDATE projetos SET nome = ($1), ultimo_acesso = (CURRENT_TIMESTAMP)  WHERE id = ($2);`;
            const values = [projeto.nome, id];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }
        

    },
    async deleteProjeto(id) {

        try {

            const data = await pool.query(`DELETE FROM projetos WHERE id = ${id}`)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
  };
  