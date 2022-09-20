export default class Api {
	static baseUrl = "http://localhost:8000";

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

	static async modifyTask(body, id) {
		const task = await fetch(`${this.baseUrl}/api/tarefa/${id}`, {
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

	static async deleteTask(body, id) {
		const task = await fetch(`${this.baseUrl}/api/tarefa/${id}`, {
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

	static async getTask(id) {
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
}