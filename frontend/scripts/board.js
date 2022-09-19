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
			console.log("entrou");
			const card2 = document.querySelector(`#${dados.id} p`);
			card2.innerText = dados.conteudo;
			break;
		case "excluir card":
			const card3 = document.getElementById(dados.id);
			card3.remove();
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

let columnCount = 1;
let addCardCount = 1;

const projectTitle = document.getElementById("nome-projeto");
projectTitle.addEventListener("change", () => {
	if (projectTitle.value.trim() != "") {
		Project.changeName(projectTitle.value.trim());
		console.log(Project.project);
	}
});

function createBoard() {
	const board = document.querySelector(".quadro");
	projectTitle.value = "Novo quadro";
	board.innerHTML = "";

	const addColumnBtn = document.createElement("button");
	addColumnBtn.className = "adicionar-coluna";
	addColumnBtn.title = "Criar nova coluna";
	const img = document.createElement("img");
	img.src = "../assets/icons/new-column.png";
	addColumnBtn.append(img);
	board.append(addColumnBtn);
	createColumn();
	createColumn();
}

/* Cria a coluna ao apertar o botão */
function createColumn(send) {
	const board = document.querySelector(".quadro");
	const column = document.createElement("div");
	column.className = "coluna";
	column.id = `coluna-${columnCount}`;
	column.addEventListener("drop", (event) => {
		DragAndDrop.onDrop(event);
	});
	column.addEventListener("dragover", (event) => {
		DragAndDrop.onDragOver(event);
	});

	const name = document.createElement("input");
	name.placeholder = "nome da coluna";
	name.value = `Nova coluna ${columnCount}`;
	name.addEventListener("change", () => {
		CardCreator.fillAllSelects();
		const newName = {
			tipo: "mudança de nome - coluna",
			id: column.id,
			nome: name.value,
		};
		ws.send(JSON.stringify(newName));
	});
	const button = document.createElement("button");
	button.className = "adicionar-card";
	button.id = `add-card-${addCardCount}`;
	button.title = "Criar novo card";
	addCardCount++;
	const img = document.createElement("img");
	img.src = "../assets/icons/new-card.png";
	button.appendChild(img);

	button.addEventListener("click", (event) => {
		event.preventDefault();
		CardCreator.createCard(button.id, true);
		/* 		project.forEach((element) => {

		}) */
	});

	column.append(name, button);
	board.insertBefore(column, document.querySelector(".adicionar-coluna"));
	const newColumn = {
		tipo: "nova coluna",
		id: column.id,
		contagem: columnCount,
	};
	if (send) {
		ws.send(JSON.stringify(newColumn));
	}
	columnCount++;
}

function menuControl() {
	let menu = document.getElementById("sidebar-menu");
	const openButton = document.getElementById("menu--button__open");

	if (window.getComputedStyle(menu).display == "none") {
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

createBoard();
const addColumnButton = document.querySelector(".adicionar-coluna");
addColumnButton.addEventListener("click", (event) => {
	createColumn(true);
});
