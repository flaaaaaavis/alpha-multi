import CardCreator from "./CardCreator.js";
import { ws, sala, udpateSala } from "./Websocket.js";
import Render from "./Render.js";
import Api from "./Api.js";
import parseJwt from "./userInfo.js";

const projects = [];
const token = localStorage.getItem("@dmkanban-token");

if (!token) {
	location.replace("../index.html");
}

const user = parseJwt(token);

localStorage.setItem("@dmkanban-userId", user.usuario.id);
let projectId;

ws.addEventListener("open", () => {
	console.log("conectado!!!");
	ws.send(JSON.stringify({ room: sala }));
	const newUser = {
		tipo: "conexão",
		usuario: user.usuario.usuario,
		sala: sala,
	};
	ws.send(JSON.stringify(newUser));
});

const exitButton = document.getElementById("sair");
exitButton.addEventListener("click", (e) => {
	e.preventDefault();
	localStorage.removeItem("@dmkanban-token");
	location.replace("../index.html");
});

const newProject = document.getElementById("criar-quadro");
newProject.addEventListener("click", async (e) => {
	e.preventDefault();
	let nome = document.getElementById("input-quadro").value;
	if (nome.trim() == "") {
		nome = "Novo quadro";
	}

	const project = {
		nome: nome,
		adm: user.usuario.id,
	};
	projectId = await Api.createProject(project);
	localStorage.setItem("@dm-kanban:id", projectId);
	ws.send(JSON.stringify({ room: sala }));
	Render.createBoard(3, nome, projectId);
});

/* Conectar ao websocket */

/* Respostas do websocket */

ws.addEventListener("message", ({ data }) => {
	const dados = JSON.parse(data);
	let card;

	switch (dados.tipo) {
		case "conexão":
			const notifications = document.querySelector(".notifications");
			const notificationUser = document.getElementById(
				"notifications-username"
			);
			notifications.classList.remove("hidden");
			notificationUser.innerText = dados.usuario;
			setTimeout(() => {
				notifications.classList.add("hidden");
			}, 5000);
			break;
		case "arrastando tarefa":
			card = document.getElementById(dados.id);
			card.classList.add("arrastando");
			break;
		case "apagar coluna":
			const apagar = document.getElementById(dados.id);
			apagar.remove();
			break;
		case "mover tarefa":
			moveCard(dados);
			break;
		case "nova coluna":
			Render.createColumn(false);
			break;
		case "nova tarefa":
			const target = document.querySelector(`#${dados.botao}`);
			CardCreator.createCard(target.id, false);
			break;
		case "mudança de nome - card":
			card = document.querySelector(`#${dados.id} .nome__card`);
			card.innerText = dados.nome;
			break;
		case "mudança de nome - coluna":
			const coluna = document.querySelector(`#${dados.id} input`);
			coluna.value = dados.nome;
			CardCreator.fillAllSelects();
			break;
		case "mudança de nome - quadro":
			const quadro = document.getElementById("nome-projeto");
			quadro.value = dados.nome;
			break;
		case "mudança de conteudo - card":
			card = document.querySelector(`#${dados.id} p`);
			card.innerText = dados.conteudo;
			break;
		case "excluir card":
			card = document.getElementById(dados.id);
			card.remove();
			break;
		case "editando tarefa":
			console.log("entrou");
			card = document.getElementById(dados.id);
			card.classList.add("editavel");
			break;
		case "fechar modal":
			card = document.getElementById(dados.id);
			card.classList.remove("editavel");
			break;
	}
});

const project = document.getElementById("nome-projeto");
project.addEventListener("change", async () => {
	const request = await Api.modifyProject({
		nome: project.value,
		id: projectId,
	});
	console.log(request);
	const newName = {
		sala: sala,
		tipo: "mudança de nome - quadro",
		nome: project.value,
	};
	ws.send(JSON.stringify(newName));
});

function moveCard(data) {
	console.log(data);
	const card = document.getElementById(data.id);
	const coluna = document.getElementById(data.coluna);
	console.log(card, coluna);
	let alvo;
	if (data.acima) {
		alvo = document.getElementById(data.acima);
		coluna.insertBefore(card, alvo);
		card.classList.remove("arrastando");
	} else {
		alvo = document.querySelector(`#${data.coluna} .adicionar-card`);
		console.log(alvo, card);
		coluna.insertBefore(card, alvo);
		card.classList.remove("arrastando");
	}
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

const closeModal = document.querySelectorAll('.close-modal-x')
// closeModal.addEventListener("click", (event) => {
// 	event.preventDefault();
// 	menuControl();
// });

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
	event.preventDefault();
	modalControl("modal--change-password__container");
});

const deleteBoardButton = document.getElementById("delete-board-button");
deleteBoardButton.addEventListener("click", (event) => {
	event.preventDefault();
	modalControl("modal--delete-board__container");
});

function editMenuInfo() {
	const username = document.getElementById("user-username");
	username.innerText = user.usuario.usuario;
	const email = document.getElementById("user-email");
	email.innerText = user.usuario.email;
}
editMenuInfo();

function modalFunctions() {
	const modal = document.querySelector(".modal");
	const openDeleteAccountModal = document.getElementById("excluir-conta");
	const deleteAccountModal = document.getElementById(
		"modal--delete-account__container"
	);
	const deleteModalButton = document.getElementById(
		"modal--delete-user-from-project__button"
	);
	const closeEmail = document.querySelector(".email-modal header span");
	const changeEmailInput = document.getElementById("mudar-email-input");

	const passwordModal = document.getElementById(
		"modal--change-password__container"
	);
	const openPasswordModal = document.getElementById("mudar-senha");
	const changePasswordButton = document.getElementById(
		"modal--change-password__button"
	);
	changePasswordButton.addEventListener("click", (e) => {
		e.preventDefault();
		changePassword();
	});

	openPasswordModal.addEventListener("click", (e) => {
		e.preventDefault();
		passwordModal.style.display = "flex";
	});

	passwordModal.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target == passwordModal) {
			passwordModal.style.display = "none";
		}
	});

	modal.addEventListener("click", (e) => {
		if (e.target == modal) {
			console.log("entrou");
			modal.classList.add("hidden");
		}
	});

	closeEmail.addEventListener("click", () => {
		modal.classList.add("hidden");
	});

	openDeleteAccountModal.addEventListener("click", () => {
		deleteAccountModal.style.display = "flex";
	});

	deleteAccountModal.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target == deleteAccountModal) {
			deleteAccountModal.style.display = "none";
		}
	});

	deleteModalButton.addEventListener("click", async (e) => {
		e.preventDefault();
		const request = await Api.deleteUser({ id: user.usuario.id });
		alert(request.result);
		localStorage.removeItem("@dmkanban-token");
		location.replace("../index.html");
	});

	changeEmailInput.addEventListener("click", async (e) => {
		const request = await changeEmail();
		alert(request);
	});
}

async function changeEmail() {
	const email = document.getElementById("input-email").value;
	if (email.trim() === "") {
		return alert("Por favor digite um email");
	} else if (!validateEmail(email)) {
		return alert("Por favor digite um email valido");
	}
	const body = {
		id: user.usuario.id,
		usuario: user.usuario.usuario,
		email: email.trim(),
	};
	const request = await Api.modifyUser(body);
	console.log(request);
	if (request.result) {
		document.getElementById("user-email").innerText = email.trim();
		return request.result;
	}
	console.log(request);
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

modalFunctions();
async function getProjects() {
	console.log(user.usuario.id);
	const body = {
		id: user.usuario.id,
	};
	const request = await Api.getAllProjects(body);
	if (request.projetos) {
		const projetosMenu = document.getElementById("lista-de-projetos");
		const uniqueProjects = [...new Set(request.projetos)];

		console.log(uniqueProjects);

		uniqueProjects.forEach(async (project) => {
			const newProject = await Api.getProjectbyId(project.projeto_id);
			const item = document.createElement("li");
			item.className = "menu--accordion__sub-item this-board__item";
			const itemButton = document.createElement("button");
			itemButton.innerText = newProject.nome;
			itemButton.value = newProject.id;
			itemButton.addEventListener("click", async (e) => {
				e.preventDefault();
				const categories = await Api.getCategoryByProject(
					itemButton.value
				);
				renderProjects(project, categories);
			});

			item.append(itemButton);
			projetosMenu.append(item);
		});
	}
}

async function renderProjects(project, categories) {
	const fullProject = await Api.getProjectbyId(project.projeto_id);
	const projectMembers = await getMembers(project);
	let tasksArray = [];
	const board = {
		name: fullProject.nome,
		members: projectMembers,
		id: fullProject.id,
		cardCount: tasksArray.length,
		columns: categories,
	};
	Render.createBoard(
		board.columns.length,
		board.name,
		board.id,
		false,
		board
	);
	localStorage.setItem("@dm-kanban:id", board.id);
	ws.send(JSON.stringify({ room: sala }));
	Render.renderData(board);
	console.log(board);
}

async function getMembers(project) {
	const body = {
		id: project.projeto_id,
	};
	const membersInfo = [];
	const members = await Api.getUsersByProject(body);
	members.projetos.forEach(async (member) => {
		const info = await Api.getUserById(member.usuario_id);
		membersInfo.push(info);
	});
	return membersInfo;
}

getProjects();
