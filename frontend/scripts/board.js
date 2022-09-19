import CardCreator from "./CardCreator.js";
import { ws, sala } from "./Websocket.js";
import ApiMock from "./ApiMock.js";
import Render from "./Render.js";
import Api from "./Api.js";

const user = JSON.parse(localStorage.getItem("@dmkanban-user"));
let projectId;

const newProject = document.getElementById("your-boards__new-board-button");
newProject.addEventListener("click", async () => {
	const project = {
		nome: "novo projeto",
	};
	projectId = await Api.createProject(project);
	localStorage.setItem("@dm-kanban:id", projectId);
	console.log(projectId);
});

const deleteProject = document.getElementById("your-boards--delete");
deleteProject.addEventListener("click", async (e) => {
	e.preventDefault();
	const project = {
		id: projectId,
	};
	const request = await Api.deleteProject(project);
	console.log(request);
});

/* Conectar ao websocket */

ws.addEventListener("open", () => {
	console.log("conectado!!!");
	ws.send(JSON.stringify({ room: sala }));
	const newUser = {
		tipo: "conexão",
		usuario: user.username,
		sala: sala,
	};
	ws.send(JSON.stringify(newUser));
});

/* renderizar o projeto */
function startBoard() {
	const board = ApiMock.getBoard(sala);
	if (!board) {
		Render.createBoard();
	} else {
		Render.createBoard();
		Render.renderData(board);
	}
}

startBoard();

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

	if (menu.style.display === "none") {
		menu.style.display = "flex";
		openButton.style.display = "none";
	} else {
		menu.style.display = "none";
		openButton.style.display = "flex";
	}
}

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

function editMenuInfo() {
	const username = document.getElementById("user-username");
	username.innerText = user.username;
	const email = document.getElementById("user-email");
	email.innerText = user.email;
}
editMenuInfo();
