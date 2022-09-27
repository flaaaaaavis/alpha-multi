import CardCreator from "./CardCreator.js";
import { ws, sala, udpateSala } from "./Websocket.js";
import Render from "./Render.js";
import Api from "./Api.js";
import parseJwt from "./userInfo.js";
import boardFunctions from "./boardFunctions.js";

const projectMembers = [];
const token = localStorage.getItem("@dm-kanban-token");
const openProject = localStorage.getItem("@dm-kanban:id");

if (!token) {
	location.replace("../index.html");
}

export const user = parseJwt(token);
console.log(user);

localStorage.setItem("@dm-kanban-userId", user.usuario.id);

ws.addEventListener("open", () => {
	console.log("conectado!!!");
	if (sala != "TypeError: Failed to fetch") {
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
			notificationUser.innerText = dados.nome_usuario;
			setTimeout(() => {
				notifications.classList.add("hidden");
			}, 5000);
			break;

		case "mudança de nome - quadro":
			const quadro = document.getElementById("nome-projeto");
			const menuProject = document.getElementById(`projeto-${sala}`);
			menuProject.innerText = dados.nome;
			quadro.value = dados.nome;
			break;

		case "excluir projeto":
			localStorage.removeItem("@dm-kanban:id");
			alert(dados.mensagem);
			location.reload();

		case "nova coluna":
			Render.renderColumn(dados);
			break;

		case "apagar coluna":
			const apagar = document.getElementById(dados.id);
			apagar.remove();
			break;

		case "mudança de nome - coluna":
			const coluna = document.querySelector(`#${dados.id} header input`);
			coluna.value = dados.nome;
			CardCreator.fillAllSelects();
			break;

		case "nova tarefa":
			const target = document.querySelector(
				`#${dados.local} .adicionar-card`
			);
			CardCreator.renderCard(target.id, dados);
			break;

		case "arrastando tarefa":
			card = document.getElementById(`${dados.id}`);
			card.classList.add("arrastando");
			break;

		case "mover tarefa":
			moveCard(dados);
			break;

		case "mudança de nome - card":
			card = document.querySelector(`#tarefa-${dados.id} .nome__card`);
			card.innerText = dados.nome;
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
			card = document.getElementById(`tarefa-${dados.id}`);
			card.classList.remove("editavel");
			break;

		case "adicionar membro":
			console.log(dados);
			break;

		case "excluir membro":
			if (dados.id == user.usuario.id) {
				removeUser();
			}
			break;

		case "mudança de membros - card":
			const membros = document.getElementById(
				`colaboradores-${dados.id}`
			);
			membros.value = JSON.stringify(dados.membros);
			break;
	}
});

/* Remove um usuário do projeto */
function removeUser() {
	alert("você foi removido desse projeto!");
	localStorage.removeItem("@dm-kanban:id");
	localStorage.getItem("@dm-kanban:adm");
	location.reload();
}

/* Move os cards pelo modal */
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

/* Edita as informações do menu */
function editMenuInfo() {
	const username = document.getElementById("user-username");
	username.innerText = user.usuario.usuario;
	const email = document.getElementById("user-email");
	email.innerText = user.usuario.email;
}
editMenuInfo();

/* modalFunctions(); */
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
			if (newProject2.erro) {
				return false;
			}
			const item = document.createElement("li");
			item.className = "your-boards__item";
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

/* Opções controle do menu */
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

/* Renderiza os projetos na tela */
async function renderProjects(project, categories) {
	menuControl();
	const colaborators = document.getElementById("projeto--membros");
	colaborators.classList.remove("hidden");
	const fullProject = await Api.getProjectbyId(project);
	console.log(fullProject);
	localStorage.setItem("@dm-kanban:adm", fullProject.adm);
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
	console.log(board.id, "board 285");
	localStorage.setItem("@dm-kanban:id", board.id);
	udpateSala();
	ws.send(JSON.stringify({ room: sala }));
	Render.renderData(board);
}

/* Pega todos os membros do projeto */
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
		console.log(info);
		membersInfo.push(info);
		projectMembers.push(info);
		const item = document.createElement("li");
		item.className = "menu--accordion__sub-item";
		const span = document.createElement("span");
		span.innerText = info.usuario;
		span.title = info.email;
		const button = document.createElement("button");
		button.value = info.id;
		const img = document.createElement("img");
		img.src = "../assets/icons/close.png";
		img.alt = "Excluir participante";
		button.append(img);

		button.addEventListener("click", async (e) => {
			e.preventDefault();
			const adm = localStorage.getItem("@dm-kanban:adm");
			if (adm != user.usuario.id) {
				alert(
					"Somente o criador do projeto pode excluir membros do projeto"
				);
			}
			if (adm == button.value) {
				return alert("Você não pode se excluir do projeto");
			}

			const body = {
				usuario_id: button.value,
				projeto_id: localStorage.getItem("@dm-kanban:id"),
			};
			if (
				confirm(
					"Tem certeza que deseja excluir esse membro do projeto?"
				) == true
			) {
				const request = await Api.removeUserFromProject(body);
				item.remove();
				const del = {
					tipo: "excluir membro",
					id: button.value,
					sala: localStorage.getItem("@dm-kanban:id"),
				};
				ws.send(JSON.stringify(del));
				alert(request.mensagem);
			}
		});
		item.append(span, button);
		list.append(item);
	});

	return membersInfo;
}

/* Adiciona um usuário ao projeto */
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

/* Botão de adicionar membro */
const addMemberButton = document.getElementById("add-participante-button");
addMemberButton.addEventListener("click", (e) => {
	e.preventDefault();
	addMemberToProject();
});

await getProjects();
boardFunctions();

/* Recarrega um projeto aberto */
async function recoverSession() {
	const categories = await Api.getCategoryByProject(openProject);
	renderProjects(openProject, categories);
}

if (openProject) {
	recoverSession();
}

/* Valida o email */
function validateEmail(email) {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
}
