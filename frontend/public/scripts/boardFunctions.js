import { ws, sala, udpateSala } from "./Websocket.js";
import Api from "./Api.js";
//import parseJwt from "./userInfo.js";
import Render from "./Render.js";
import { user } from "./board.js";

export default async function boardFunctions() {
	const exitButton = document.getElementById("sair");
	exitButton.addEventListener("click", (e) => {
		e.preventDefault();
		localStorage.removeItem("@dm-kanban-token");
		location.replace("../index.html");
	});

	const newProject = document.getElementById("criar-quadro");
	newProject.addEventListener("click", async (e) => {
		const colaborators = document.getElementById("projeto--membros");
		colaborators.classList.remove("hidden");
		await fillProjectMenu(e);
		console.log("entrou");
	});

	const project = document.getElementById("nome-projeto");
	project.addEventListener("change", async () => {
		const request = await Api.modifyProject({
			nome: project.value,
			id: localStorage.getItem("@dm-kanban:id"),
		});
		const menuProject = document.getElementById(`projeto-${sala}`);
		menuProject.innerText = project.value;
		console.log(request);
		const newName = {
			sala: sala,
			tipo: "mudança de nome - quadro",
			nome: project.value,
		};
		ws.send(JSON.stringify(newName));
	});

	const closeModal = document.querySelectorAll(".close-modal-x");
	closeModal.forEach((element) => {
		element.addEventListener("click", (e) => {
			const target = e.target.parentElement.parentElement;
			modalControl(target.id);
		});
	});

	const openButton = document.getElementById("menu--button__open");
	openButton.addEventListener("click", (event) => {
		event.preventDefault();
		menuControl();
	});

	const closeButton = document.getElementById("closeMenuButton");
	closeButton.addEventListener("click", (event) => {
		event.preventDefault();
		menuControl();
	});

	const deleteAccountButton = document.getElementById("excluir-conta");
	deleteAccountButton.addEventListener("click", (event) => {
		event.preventDefault();
		modalControl("modal--delete-account__container");
	});

	const changeEmailButton = document.getElementById("mudar-email");
	changeEmailButton.addEventListener("click", (event) => {
		event.preventDefault();
		modalControl("modal--change-email__container");
	});

	const changePassButton = document.getElementById("mudar-senha");
	changePassButton.addEventListener("click", (event) => {
		console.log("entrou");
		event.preventDefault();
		modalControl("modal--change-password__container");
	});

	const deleteBoardButton = document.getElementById("delete-board-button");
	deleteBoardButton.addEventListener("click", (event) => {
		event.preventDefault();
		modalControl("modal--delete-board__container");
		deleteProject();
	});
}

function menuControl() {
	let menu = document.getElementById("sidebar-menu");
	const openButton = document.getElementById("menu--button__open");

	if (window.getComputedStyle(menu).display === "none") {
		menu.style.display = "flex";
		openButton.style.display = "none";
	} else {
		menu.style.display = "none";
		openButton.style.display = "flex";
	}
}

function modalControl(modalId) {
	const modal = document.getElementById(modalId);

	if (window.getComputedStyle(modal).display === "none") {
		modal.style.display = "flex";
	} else {
		modal.style.display = "none";
	}
	modal.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target == modal) {
			modal.style.display = "none";
		}
	});
}

async function deleteProject() {
	const deleteBtn = document.getElementById("modal--delete-board__button");
	deleteBtn.addEventListener("click", async (e) => {
		e.preventDefault();
		const request = await Api.deleteProject({
			id: localStorage.getItem("@dm-kanban:id"),
			adm: user.usuario.id,
		});
		if (request == 201) {
			localStorage.removeItem("@dm-kanban:id");
			const change = {
				sala: sala,
				tipo: "excluir projeto",
				mensagem:
					"Esse projeto foi excluido pelo administrador, ele será fechado a seguir.",
			};
			ws.send(JSON.stringify(change));
			alert("projeto excluido com sucesso");
			location.reload();
		} else if (request == 400) {
			alert("Somente o administrador do projeto pode exclui-lo");
		}
	});
}

function modalFunctions() {
	const modal = document.querySelector(".modal");
	const deleteModalButton = document.getElementById(
		"modal--delete-account__button"
	);
	const changeEmailButton = document.getElementById(
		"modal--change-email__button"
	);

	const changePasswordButton = document.getElementById(
		"modal--change-password__button"
	);
	changePasswordButton.addEventListener("click", (e) => {
		e.preventDefault();
		changePassword();
	});

	modal.addEventListener("click", (e) => {
		if (e.target == modal) {
			console.log("entrou");
			modal.classList.add("hidden");
		}
	});

	deleteModalButton.addEventListener("click", async (e) => {
		e.preventDefault();
		console.log("entrou");
		const request = await Api.deleteUser({ id: user.usuario.id });
		alert(request.result);
		localStorage.removeItem("@dmkanban-token");
		localStorage.removeItem("@dm-kanban-userId");
		location.replace("../index.html");
	});

	changeEmailButton.addEventListener("click", async (e) => {
		const request = await changeEmail();
		alert(request);
	});
}

async function fillProjectMenu(e) {
	e.preventDefault();
	let nome = document.getElementById("input-quadro").value;
	menuControl();
	if (nome.trim() == "") {
		nome = "Novo quadro";
	}

	const project = {
		nome: nome,
		adm: user.usuario.id,
	};
	const projectId = await Api.createProject(project);
	localStorage.setItem("@dm-kanban:id", projectId);
	udpateSala();
	const projectList = document.getElementById("lista-de-projetos");
	const item = document.createElement("li");
	item.className = "menu--accordion__sub-item this-board__item";
	const listButton = document.createElement("button");
	listButton.value = projectId;
	listButton.innerText = nome.trim();
	listButton.addEventListener("click", async (e) => {
		console.log("clicado");
		e.preventDefault();
		const categories = await Api.getCategoryByProject(listButton.value);
		console.log(categories);
		renderProjects(project, categories);
	});

	item.append(listButton);
	projectList.append(item);

	ws.send(
		JSON.stringify({ tipo: "conexão", room: projectId, sala: projectId })
	);
	Render.createBoard(3, nome, projectId);
	getProjects();
}

async function changeEmail() {
	const email = document.getElementById(
		"modal--change-email__new-email"
	).value;
	const confirmEmail = document.getElementById(
		"modal--change-email__repeat-new-email"
	).value;
	if (email != confirmEmail) {
		return alert("Os e-mails não são iguais");
	}
	if (email.trim() === "") {
		// return alert("Por favor digite um email");
	} else if (!validateEmail(email)) {
		// return alert("Por favor digite um email valido");
	}
	const body = {
		id: user.usuario.id,
		usuario: user.usuario.usuario,
		email: email.trim(),
	};
	const request = await Api.modifyUser(body);
	if (request.result) {
		console.log(request);
		user.usuario.email = email.trim();
		document.getElementById("user-email").innerText = email.trim();
		return request.result;
	}
	return request;
}

function validateEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}

async function changePassword() {
	const newPassword = document.getElementById(
		"modal--change-password__new-pass"
	).value;
	const newPasswordRepeat = document.getElementById(
		"modal--change-password__repeat-new-pass"
	).value;
	if (newPassword.trim() != newPasswordRepeat.trim()) {
		return alert("As senhas não são iguais");
	}
	const body = {
		id: user.usuario.id,
		senha: newPassword.trim(),
	};
	const request = await Api.editUserPassword(body);
	console.log(request);
	if (request.result) {
		return alert(request.result);
	}
	return request;
}

async function getProjects() {
	const body = {
		id: user.usuario.id,
	};
	const request = await Api.getAllProjects(body);
	if (request.projetos) {
		const projetosMenu = document.getElementById("lista-de-projetos");
		const addProjetos = document.getElementById("add-projetos");
		projetosMenu.innerHTML = "";
		projetosMenu.append(addProjetos);
		const uniqueIds = [];
		const uniqueProjects = request.projetos.filter((element) => {
			const isDuplicate = uniqueIds.includes(element.projeto_id);

			if (!isDuplicate) {
				uniqueIds.push(element.projeto_id);

				return true;
			}
		});

		uniqueIds.forEach(async (project) => {
			const newProject2 = await Api.getProjectbyId(project);
			const item = document.createElement("li");
			item.className = "menu--accordion__sub-item this-board__item";
			const itemButton = document.createElement("button");
			itemButton.innerText = newProject2.nome;
			itemButton.id = `projeto-${newProject2.id}`;
			itemButton.value = newProject2.id;
			itemButton.addEventListener("click", async (e) => {
				console.log(console.log(itemButton.value));
				e.preventDefault();
				const categories = await Api.getCategoryByProject(
					itemButton.value
				);
				console.log(categories);
				renderProjects(project, categories);
			});

			item.append(itemButton);
			projetosMenu.append(item);
		});
	}
}

modalFunctions();
