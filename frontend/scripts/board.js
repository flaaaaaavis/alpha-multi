import DragAndDrop from './dragAndDrop.js';
import CardCreator from './CardCreator.js';

let columnCount = 4;
let tapedTwice = false;
/* Ativa as funções drag and drop */
function activateDnd(){
	const addColumnButton = document.querySelector(".add-coluna");
	const addCardButton = document.querySelectorAll(".add-card");
	const columnName = document.querySelectorAll(".coluna input");
	const drag = document.querySelectorAll(".arrastavel");
	const drop = document.querySelectorAll(".coluna");

	addCardButton.forEach((element) => {
		element.addEventListener('click', (event) => {
			CardCreator.createCard(event.currentTarget)
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

	columnName.forEach((element) => {
		element.addEventListener('change', () => {
			console.log('x');
			CardCreator.fillAllSelects();
		})
	})
}

/* Cria a coluna ao apertar o botão */
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
	name.addEventListener('change', () => {
		console.log('x');
		CardCreator.fillAllSelects();
	})
	const button = document.createElement('button');
	button.className = 'add-card';
	button.innerText = '+';

	button.addEventListener('click', (event) => {
		createCard(event.currentTarget)
	});

	column.append(name, button);
	board.insertBefore(column, target);

	CardCreator.fillAllSelects();
}

activateDnd();


