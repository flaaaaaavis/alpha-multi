import DragAndDrop from "./dragAndDrop.js";
import CardCreator from "./CardCreator.js";
import Project from "./Project.js";
import { ws } from "./Websocket.js";

ws.addEventListener("open", () => {
	console.log("conectado!!!");
});

ws.addEventListener("message", ({ data }) => {
	const dados = JSON.parse(data);

	if (dados.tipo == "mover tarefa") {
		moveCard(dados);
	} else if (dados.tipo == "nova coluna") {
		const addColumnButton = document.querySelector(".adicionar-coluna");
		createColumn(addColumnButton, false);
	} else if (dados.tipo == "nova tarefa") {
		const target = document.querySelector(`#${dados.botao}`);
		CardCreator.createCard(target.id, false);
	} else if (dados.tipo == "mudança de nome - card") {
		const card = document.querySelector(`#${dados.id} .nome__card`);
		card.innerText = dados.nome;
	} else if (dados.tipo == "mudança de nome - coluna") {
		const coluna = document.querySelector(`#${dados.id} input`);
		coluna.value = dados.nome;
	}
});

function moveCard(data) {
	const card = document.getElementById(data.card);
	const coluna = document.getElementById(data.coluna);
	console.log(coluna);
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
		console.log(Project.project);
	}
});

/* Ativa as funções drag and drop */
function activateDnd() {
	const addColumnButton = document.querySelector(".adicionar-coluna");
	const addCardButton = document.querySelectorAll(".adicionar-card");
	const columnName = document.querySelectorAll(".coluna input");
	const drag = document.querySelectorAll(".arrastavel");
	const drop = document.querySelectorAll(".coluna");

	/* Cria um novo card na coluna */
	addCardButton.forEach((element) => {
		element.addEventListener("click", (event) => {
			CardCreator.createCard(event.currentTarget);
		});
	});

	/* Cria uma nova coluna */
	addColumnButton.addEventListener("click", (event) => {
		createColumn(event.target, true);
	});

	/* Quando um card é arrastado executa a função de arrastar */
	drag.forEach((element) => {
		element.addEventListener("dragstart", (event) => {
			DragAndDrop.onDragStart(event);
		});
	});

	/* Quando um card é colocado em uma coluna confere o que deve ser feito */
	drop.forEach((element) => {
		element.addEventListener("dragover", (event) => {
			DragAndDrop.onDragOver(event);
		});
		element.addEventListener("drop", (event) => {
			DragAndDrop.onDrop(event);
		});
	});

	/* Atualiza o nome das colunas no select de coluna do mobile */
	columnName.forEach((element) => {
		element.addEventListener("change", () => {
			CardCreator.fillAllSelects();
		});
	});
}

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
	name.value = "Nova coluna";
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
	addCardCount++;
	button.innerText = "+";

	button.addEventListener("click", (event) => {
		CardCreator.createCard(button.id, true);
		/* 		project.forEach((element) => {

		}) */
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

	CardCreator.fillAllSelects();
}

//activateDnd();
createBoard();
