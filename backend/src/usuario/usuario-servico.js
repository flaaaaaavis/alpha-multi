import { v4 as uuidv4 } from "uuid";
import { hashPwd } from "../hashPwd.js";
import { pool } from "../db.js";

export const UserService = {
	async getUsuario(id) {
		try {
			const data = await pool.query(
				`SELECT id, email, usuario FROM usuarios WHERE id = '${id}'`
			);
			return data.rows[0];
		} catch (e) {
			console.log(e);
		}
	},
	async getUsuarioByEmail(email) {
		try {
			console.log("email", email);
			const data = await pool.query(
				`SELECT id, email, usuario, senha FROM usuarios WHERE email = '${email}'`
			);
			return data.rows[0];
		} catch (e) {
			console.log(e);
		}
	},
	async insertUsuario(usuario) {
		try {
			console.log(usuario);

			const id = uuidv4();
			const senha = hashPwd(usuario.senha);

			const query = `INSERT INTO usuarios (id, data_criacao, usuario, email, senha) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4)`;
			const values = [id, usuario.usuario, usuario.email, senha];
			const data = await pool.query(query, values);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
	async updateUsuario(id, usuario) {
		try {
			const query = `UPDATE usuarios SET usuario = ($1), email = ($2) WHERE id = ($3);`;
			const values = [usuario.usuario, usuario.email, id];
			const data = await pool.query(query, values);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
	async deleteUsuario(id) {
		try {
			const data = await pool.query(
				`
				DELETE FROM projetos_usuarios WHERE usuario_id = '${id}';
				DELETE FROM usuarios WHERE id = '${id}'`
			);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
	async updateUsuarioSenha(id, novaSenha) {
		try {
			const query = `UPDATE usuarios SET senha = ($1) WHERE id = ($2) RETURNING id;`;
			const values = [novaSenha, id];
			const data = await pool.query(query, values);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
	async getProjetosPorUsuario(id) {
		try {
			console.log(id);
			const projeto = await pool.query(
				`SELECT projeto_id FROM projetos_usuarios WHERE usuario_id = '${id}'`
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
	async insertUsuarioProjeto(usuario_id, projeto_id) {
		try {
			const query = `INSERT INTO projetos_usuarios (usuario_id, projeto_id) VALUES ($1, $2)`;
			const values = [usuario_id, projeto_id];
			const data = await pool.query(query, values);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
	async deleteUsuarioProjeto(usuario_id, projeto_id) {
		try {
			const data = await pool.query(
				`DELETE FROM projetos_usuarios WHERE usuario_id = '${usuario_id}' AND projeto_id = '${projeto_id}' LIMIT 1`
			);
			return data;
		} catch (e) {
			console.log(e);
		}
	},
};
