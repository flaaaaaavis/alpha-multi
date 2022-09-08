import DragAndDrop from './dragAndDrop.js';

let cardCounter = 0;
let columnCount = 4;

/* Ativa as funções drag and drop */
function activateDnd(){
	const addColumnButton = document.querySelector(".add-coluna");
	const addCardButton = document.querySelectorAll(".add-card");
	const drag = document.querySelectorAll(".arrastavel");
	const drop = document.querySelectorAll(".coluna");

	addCardButton.forEach((element) => {
		element.addEventListener('click', (event) => {
			createCard(event.currentTarget)
		})
	})

	addColumnButton.addEventListener('click', (event) => {
		createColumn(event.target);
	})
	drag.forEach((element) => {
		element.addEventListener("dragstart", (event) => {
			DragAndDrop.onDragStart(event);
		});
	});

	drop.forEach((element) => {
		element.addEventListener("dragover", (event) => {
			DragAndDrop.onDragOver(event);
		});
		element.addEventListener("drop", (event) => {
			DragAndDrop.onDrop(event);
		});
	});
}

function createCard(target){
	const parent = target.parentElement;

	const card = document.createElement('div');
	card.className = 'arrastavel';
	card.id = `arrastavel-${cardCounter}`;
	card.draggable = true;

	const cardName = document.createElement('textarea');
	cardName.className = 'nome__card';
	cardName.placeholder = 'Nome da tarefa';

	const cardContent = document.createElement("textarea");
	cardContent.className = 'conteudo__card';
	cardContent.placeholder = 'digite o conteúdo da tarefa';
	card.addEventListener("dragstart", (event) => {
		DragAndDrop.onDragStart(event);
	});

	card.append(cardName, cardContent);
	parent.insertBefore(card, target);
	cardCounter++;
}

function createColumn(target){
	console.log(target);
	const board = document.querySelector('.quadro');

	const column = document.createElement('div');
	column.className = 'coluna';
	column.id = `coluna-${columnCount}`;
	columnCount++;
	column.addEventListener("drop", (event) => {
		DragAndDrop.onDrop(event);
	});
	column.addEventListener("dragover", (event) => {
		DragAndDrop.onDragOver(event);
	});

	const name = document.createElement('input');
	name.placeholder = 'nome da coluna';
	name.value = 'Nova coluna';
	const button = document.createElement('button');
	button.className = 'add-card';
	button.innerText = '+';

	button.addEventListener('click', (event) => {
		createCard(event.currentTarget)
	})

	column.append(name, button);
	board.insertBefore(column, target);
}

activateDnd();


