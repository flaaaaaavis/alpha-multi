import DragAndDrop from "./dragAndDrop.js";
import CardCreator from "./CardCreator.js";
import Project from "./Project.js";
import { ws } from "./Websocket.js";

ws.addEventListener("open", () => {
	console.log("conectado!!!");
});

ws.addEventListener("message", ({ data }) => {
	const dados = JSON.parse(data);

	switch (dados.tipo) {
		case "mover tarefa":
			moveCard(dados);
			break;
		case "nova coluna":
			const addColumnButton = document.querySelector(".adicionar-coluna");
			createColumn(addColumnButton, false);
			CardCreator.fillAllSelects();
			break;
		case "nova tarefa":
			const target = document.querySelector(`#${dados.botao}`);
			CardCreator.createCard(target.id, false);
			break;
		case "mudança de nome - card":
			const card = document.querySelector(`#${dados.id} .nome__card`);
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
			const card2 = document.querySelector(`#${dados.id} p`);
			card2.innerText = dados.conteudo;
			break;
		case "excluir card":
			const card3 = document.getElementById(dados.id);
			card3.remove();
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
	const card = document.getElementById(data.card);
	const coluna = document.getElementById(data.coluna);
	let alvo;
	if (data.acima) {
		alvo = document.getElementById(data.acima);
		coluna.insertBefore(card, alvo);
	} else {
		alvo = document.querySelector(`#${data.coluna} button`);
		coluna.insertBefore(card, alvo);
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
	addColumnBtn.innerText = "+";
	board.append(addColumnBtn);
	createColumn(addColumnBtn);
	createColumn(addColumnBtn);
}

/* Cria a coluna ao apertar o botão */
function createColumn(target, send) {
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
	addCardCount++;
	button.innerText = "+";

	button.addEventListener("click", () => {
		CardCreator.createCard(button.id, true);
	});

	column.append(name, button);
	board.insertBefore(column, target);
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

createBoard();
const addColumnButton = document.querySelector(".adicionar-coluna");
addColumnButton.addEventListener("click", (event) => {
	createColumn(event.target, true);
});
