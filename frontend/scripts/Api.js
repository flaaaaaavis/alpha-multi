export default class Api {
	static baseUrl = "http://localhost:8000";

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
}
