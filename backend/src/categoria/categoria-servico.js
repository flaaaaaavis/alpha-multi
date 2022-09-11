import { pool } from "../db";
import config from "../config";

export const CategoryService = {
    async getCategoriasPorProjeto(projeto_id) {

        try {

            const data = await pool.query(`SELECT * FROM categorias WHERE projeto_id = ${projeto_id}`)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async insertCategoria(categoria) {

        try {

            const query = `INSERT INTO categorias (projeto_id, data_criacao, nome, ordem) VALUES ($1, CURRENT_TIMESTAMP, $3, $4)`;
            const values = [categoria.projeto_id, categoria.nome, categoria.ordem];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async updateCategoria(id, categoria) {

        try {           

            const query = `UPDATE categorias SET projeto_id = ($1), nome = ($2), ordem = ($3)  WHERE id = ($4);`;
            const values = [categoria.projeto_id, categoria.nome, categoria.ordem, id];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }
        

    },
    async deleteCategoria(id) {

        try {

            const data = await pool.query(`DELETE FROM categorias WHERE id = ${id}`)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
  };
  