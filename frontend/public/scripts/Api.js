export default class Api {
	static baseUrl = "http://207.246.126.10:8000";
	//static baseUrl = "http://localhost:8000";

	/* Registra um usuário */
	static async register(body) {
		const usuario = await fetch(`${this.baseUrl}/api/usuario/`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return usuario;
	}

	/* Login */
	static async login(body) {
		const usuario = await fetch(`${this.baseUrl}/api/usuario/login`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return usuario;
	}

	/* Modifica um usuario */
	static async modifyUser(body) {
		const usuario = await fetch(`${this.baseUrl}/api/usuario/`, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return usuario;
	}

	/* Modifica a senha do usuário */
	static async editUserPassword(body) {
		const usuario = await fetch(`${this.baseUrl}/api/usuario/senha`, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return usuario;
	}

	/* Deleta um usuário */
	static async deleteUser(body) {
		const usuario = await fetch(`${this.baseUrl}/api/usuario/`, {
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return usuario;
	}

	/* Cria um projeto */
	static async createProject(body) {
		const project = await fetch(`${this.baseUrl}/api/projeto`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Modifica um projeto */
	static async modifyProject(body) {
		const project = await fetch(`${this.baseUrl}/api/projeto`, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Deleta um projeto */
	static async deleteProject(body) {
		const project = await fetch(`${this.baseUrl}/api/projeto`, {
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.status;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Cria uma categoria (coluna) */
	static async createCategory(body) {
		const category = await fetch(`${this.baseUrl}/api/categoria`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return category;
	}

	/* Modifica uma categoria */
	static async modifyCategory(body, id) {
		const category = await fetch(`${this.baseUrl}/api/categoria/${id}`, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return category;
	}

	/* Deleta uma categoria */
	static async deleteCategory(body, id) {
		const category = await fetch(`${this.baseUrl}/api/categoria/${id}`, {
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.status;
			})
			.catch((err) => {
				return err;
			});

		return category;
	}

	/* Cria uma tarefa */
	static async createTask(body) {
		const task = await fetch(`${this.baseUrl}/api/tarefa`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return task;
	}

	/* Modifica uma tarefa */
	static async modifyTask(body) {
		const task = await fetch(`${this.baseUrl}/api/tarefa/`, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return task;
	}

	/* Deleta uma tarefa */
	static async deleteTask(body) {
		const task = await fetch(`${this.baseUrl}/api/tarefa`, {
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.status;
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return task;
	}

	/* Pega uma tarefa de acordo com o id da categoria */
	static async getTaskByCategory(id) {
		const task = await fetch(`${this.baseUrl}/api/tarefa/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return task;
	}

	/* Pega um projeto pelo id */
	static async getProjectbyId(id) {
		const project = await fetch(`${this.baseUrl}/api/projeto/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Pega uma categoria pelo id do projeto */
	static async getCategoryByProject(id) {
		const project = await fetch(`${this.baseUrl}/api/categoria/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Pega o usuário pelo id */
	static async getUserById(id) {
		const project = await fetch(`${this.baseUrl}/api/usuario/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Pega o usuario pela senha */
	static async getUserByEmail(email) {
		const project = await fetch(
			`${this.baseUrl}/api/usuario/email/${email}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Pega todos os projetos que um usuário está envolvido */
	static async getAllProjects(body) {
		const project = await fetch(`${this.baseUrl}/api/usuario/projetos`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Pega os usuários de acordo com o projeto */
	static async getUsersByProject(body) {
		const project = await fetch(`${this.baseUrl}/api/projeto/usuarios`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Adiciona usuario a um projeto pelo email */
	static async addUserToProjectByEmail(body) {
		const project = await fetch(`${this.baseUrl}/api/projeto/membros`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}

	/* Remove um usuário do projeto */
	static async removeUserFromProject(body) {
		const project = await fetch(`${this.baseUrl}/api/projeto/membros`, {
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return err;
			});

		return project;
	}
}
