import CardCreator from "./CardCreator.js";
import { ws, sala, udpateSala } from "./Websocket.js";
import Render from "./Render.js";
import Api from "./Api.js";
import parseJwt from "./userInfo.js";

const projectMembers = [];
const token = localStorage.getItem("@dm-kanban-token");
const openProject = localStorage.getItem("@dm-kanban:id");

if (!token) {
	location.replace("../index.html");
}

const user = parseJwt(token);
console.log(user);

localStorage.setItem("@dm-kanban-userId", user.usuario.id);

ws.addEventListener("open", () => {
	console.log("conectado!!!");
	if (sala != "TypeError: Failed to fetch") {
		console.log(sala);
		ws.send(JSON.stringify({ room: sala }));
		const newUser = {
			tipo: "conexão",
			usuario: user.usuario.id,
			sala: sala,
			nome_usuario: user.usuario.usuario,
		};
		ws.send(JSON.stringify(newUser));
	} else {
		ws.send(JSON.stringify({ room: user.usuario.id }));
	}
});

ws.addEventListener("close", (e) => {
	console.log(
		"Socket is closed. Reconnect will be attempted in 5 seconds.",
		e.reason
	);
	setTimeout(function () {
		location.reload();
	}, 5000);
});

ws.addEventListener("error", (e) => {
	console.error("Socket encountered error: ", err.message, "Closing socket");
	ws.close();
});

const exitButton = document.getElementById("sair");
exitButton.addEventListener("click", (e) => {
	e.preventDefault();
	localStorage.removeItem("@dm-kanban-token");
	location.replace("../index.html");
});

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

const newProject = document.getElementById("criar-quadro");
newProject.addEventListener("click", async (e) => {
	await fillProjectMenu(e);
	console.log("entrou");
});

/* Respostas do websocket */

ws.addEventListener("message", ({ data }) => {
	const dados = JSON.parse(data);
	let card;

	switch (dados.tipo) {
		case "conexão":
			console.log(dados);
			const notifications = document.querySelector(".notifications");
			const notificationUser = document.getElementById(
				"notifications-username"
			);
			notifications.classList.remove("hidden");
			notificationUser.innerText = dados.nome_usuario;
			setTimeout(() => {
				notifications.classList.add("hidden");
			}, 5000);
			break;
		case "arrastando tarefa":
			card = document.getElementById(`${dados.id}`);
			card.classList.add("arrastando");
			break;
		case "apagar coluna":
			const apagar = document.getElementById(`tarefa-${dados.id}`);
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
			console.log(target);
			CardCreator.renderCard(target.id, dados);
			break;
		case "mudança de nome - card":
			card = document.querySelector(`#tarefa-${dados.id} .nome__card`);
			card.innerText = dados.nome;
			break;
		case "mudança de nome - coluna":
			const coluna = document.querySelector(`#coluna-${dados.id} input`);
			coluna.value = dados.nome;
			CardCreator.fillAllSelects();
			break;
		case "mudança de nome - quadro":
			const quadro = document.getElementById("nome-projeto");
			const menuProject = document.getElementById(`projeto-${sala}`);
			menuProject.innerText = dados.nome;
			quadro.value = dados.nome;
			break;
		case "mudança de conteudo - card":
			card = document.querySelector(`#tarefa-${dados.id} p`);
			card.innerText = dados.conteudo;
			break;
		case "excluir card":
			card = document.getElementById(`tarefa-${dados.id}`);
			card.remove();
			break;
		case "editando tarefa":
			console.log(dados.id);
			card = document.getElementById(`tarefa-${dados.id}`);
			card.classList.add("editavel");
			break;
		case "fechar modal":
			console.log(dados.id);
			card = document.getElementById(`tarefa-${dados.id}`);
			card.classList.remove("editavel");
			break;
		case "adicionar membro":
			console.log(dados);
			break;
		case "mudança de membros - card":
			console.log(dados);
			const membros = document.getElementById(
				`colaboradores-${dados.id}`
			);
			membros.value = JSON.stringify(dados.membros);
			break;
		case "excluir projeto":
			localStorage.removeItem("@dm-kanban:id");
			alert(dados.mensagem);
			location.reload();
	}
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

function moveCard(data) {
	console.log(data);
	const card = document.getElementById(data.id);
	const coluna = document.getElementById(data.coluna);
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
	const modal = document.getElementById(modalId)

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
	event.preventDefault();
	modalControl("modal--change-password__container");
});

const deleteBoardButton = document.getElementById("delete-board-button");
deleteBoardButton.addEventListener("click", (event) => {
	event.preventDefault();
	modalControl("modal--delete-board__container");
	deleteProject();
});

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
	const changeEmailButton = document.getElementById(
		"modal--change-email__button"
	);

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
		// alert(request.result);
		localStorage.removeItem("@dmkanban-token");
		location.replace("../index.html");
	});

	changeEmailButton.addEventListener("click", async (e) => {
		const request = await changeEmail();
		// alert(request);
	});
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
		// return alert("As senhas não são iguais");
	}
	const body = {
		id: user.usuario.id,
		senha: newPassword.trim(),
	};
	const request = await Api.editUserPassword(body);
	console.log(request);
	if (request.result) {
		// return alert(request.result);
	}
	return request;
}

modalFunctions();
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

async function renderProjects(project, categories) {
	menuControl();
	const colaborators = document.getElementById("projeto--membros");
	colaborators.classList.remove("hidden");
	const fullProject = await Api.getProjectbyId(project);
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
	udpateSala();
	ws.send(JSON.stringify({ room: sala }));
	Render.renderData(board);
}

async function getMembers(project) {
	const body = {
		id: project,
	};
	const membersInfo = [];
	const list = document.getElementById("project-members-list");
	const addMemberItem = document.getElementById("add-member-form");
	list.innerHTML = "";
	list.append(addMemberItem);
	const members = await Api.getUsersByProject(body);
	members.projetos.forEach(async (member) => {
		const info = await Api.getUserById(member.usuario_id);
		membersInfo.push(info);
		projectMembers.push(info);
		const item = document.createElement("li");
		item.className = "menu--accordion__sub-item";
		const span = document.createElement("span");
		span.innerText = info.usuario;
		span.title = info.email;
		const button = document.createElement("button");
		const img = document.createElement("img");
		img.src = "../assets/icons/close.png";
		img.alt = "Excluir participante";
		button.append(img);
		item.append(span, button);
		list.append(item);
	});

	return membersInfo;
}

async function addMemberToProject() {
	const input = document.getElementById("adicionar-participante").value;
	const email = validateEmail(input);
	if (email) {
		const body = {
			projeto_id: localStorage.getItem("@dm-kanban:id"),
			email: input.trim(),
		};
		const newMember = await Api.getUserByEmail(input.trim());
		const projectName = document.getElementById("nome-projeto").value;
		const request = await Api.addUserToProjectByEmail(body);
		if (request.result) {
			alert(request.result);
			ws.send(
				JSON.stringify({
					tipo: "adicionar membro",
					para: newMember.id,
					por: user.usuario.usuario,
					nome_projeto: projectName,
				})
			);
		} else if (request.erro) {
			alert(request.erro);
		} else {
			alert("usuário não encontrado");
		}
	}
}

const addMemberButton = document.getElementById("add-participante-button");
addMemberButton.addEventListener("click", (e) => {
	e.preventDefault();
	addMemberToProject();
});

await getProjects();

async function recoverSession() {
	const categories = await Api.getCategoryByProject(openProject);
	renderProjects(openProject, categories);
}

if (openProject) {
	recoverSession();
}
