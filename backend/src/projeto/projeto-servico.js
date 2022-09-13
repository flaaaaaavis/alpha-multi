import { pool } from "../db.js";
import { v4 as uuidv4 } from 'uuid';

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

            const id = uuidv4()
            const query = `INSERT INTO projetos (id, nome, data_criacao, ultimo_acesso) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
            const values = [id, projeto.nome];
            await pool.query(query, values)
            return id;

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

            const data = await pool.query("DELETE FROM projetos WHERE id = '"+id+"'")
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
  };
  
