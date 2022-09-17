import { v4 as uuidv4 } from 'uuid';
const { hashPwd } = require("../hashPwd");
import { pool } from "../db"


export const UserService = {
    async getUsuario(id) {

        try {

            const data = await pool.query(`SELECT * FROM usuarios WHERE id = ${id}`)
            return data.rows[0];

        } catch(e) {

            console.log(e)

        }

    },
    async getUsuarioByEmail(email) {

        try {

            const data = await pool.query(`SELECT * FROM usuarios WHERE id = ${email}`)
            return data.rows[0];

        } catch(e) {

            console.log(e)

        }

    },
    async insertUsuario(usuario){

        try {

            const id = uuidv4();
            const senha = hashPwd(usuario.senha);

            const query = `INSERT INTO usuarios (id, data_criacao, usuario, email, senha) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4)`;
            const values = [id, usuario.usuario, usuario.email, senha];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async updateUsuario(id, usuario) {

        try {           

            const query = `UPDATE usuarios SET usuario = ($1), email = ($2) WHERE id = ($3);`;
            const values = [usuario.usuario, usuario.email, id];
            const data = await pool.query(query, values)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    },
    async deleteUsuario(id) {

        try {

            const data = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`)
            return data.rows;

        } catch(e) {

            console.log(e)

        }

    }

}