import DragAndDrop from "./dragAndDrop.js";
import CardCreator from "./CardCreator.js";
import Project from "./Project.js";
import { ws } from "./Websocket.js";

ws.addEventListener("open", () => {
	console.log("conectado!!!");
});

ws.addEventListener("message", ({ data }) => {
	const dados = JSON.parse(data);
	let card;

	switch (dados.tipo) {
		case "arrastando tarefa":
			card = document.getElementById(dados.id);
			card.classList.add("arrastando");
			break;
		case "mover tarefa":
			moveCard(dados);
			break;
		case "nova coluna":
			createColumn(false);
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
project.addEventListener("change", () => {
	const newName = {
		tipo: "mudança de nome - quadro",
		nome: project.value,
	};
	ws.send(JSON.stringify(newName));
});

function moveCard(data) {
	const card = document.getElementById(data.id);
	const coluna = document.getElementById(data.coluna);
	let alvo;
	if (data.acima) {
		alvo = document.getElementById(data.acima);
		coluna.insertBefore(card, alvo);
		card.classList.remove("arrastando");
	} else {
		alvo = document.querySelector(`#${data.coluna} button`);
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
	createColumn(false);
	createColumn(false);
}

/* Cria a coluna ao apertar o botão */
function createColumn(send) {
	console.log("send");
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

createBoard();
const addColumnButton = document.querySelector(".adicionar-coluna");
addColumnButton.addEventListener("click", (event) => {
	createColumn(true);
});
