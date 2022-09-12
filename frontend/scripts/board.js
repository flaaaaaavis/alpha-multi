import DragAndDrop from './dragAndDrop.js';
import CardCreator from './CardCreator.js';
import Project from './Project.js';

let columnCount = 1;


const projectTitle = document.getElementById('nome-projeto');
projectTitle.addEventListener('change', () => {
	if(projectTitle.value.trim() != ''){
		Project.changeName(projectTitle.value.trim());
		console.log(Project.project);
	}
})

/* Ativa as funções drag and drop */
function activateDnd(){
	const addColumnButton = document.querySelector(".adicionar-coluna");
	const addCardButton = document.querySelectorAll(".adicionar-card");
	const columnName = document.querySelectorAll(".coluna input");
	const drag = document.querySelectorAll(".arrastavel");
	const drop = document.querySelectorAll(".coluna");

	/* Cria um novo card na coluna */
	addCardButton.forEach((element) => {
		element.addEventListener('click', (event) => {
			CardCreator.createCard(event.currentTarget)
		})
	})

	/* Cria uma nova coluna */
	addColumnButton.addEventListener('click', (event) => {
		createColumn(event.target);
	})

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
		element.addEventListener('change', () => {
			CardCreator.fillAllSelects();
		})
	})
}

function createBoard(){
	const board = document.querySelector('.quadro');
	projectTitle.value = 'Novo quadro';
	board.innerHTML = '';

	const addColumnBtn = document.createElement('button');
	addColumnBtn.className = 'adicionar-coluna';
	addColumnBtn.innerText = '+';
	board.append(addColumnBtn);
}

/* Cria a coluna ao apertar o botão */
function createColumn(target){
	const columnObject = {};
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
	button.className = 'adicionar-card';
	button.innerText = '+';

	button.addEventListener('click', (event) => {
		CardCreator.createCard(event.currentTarget);
/* 		project.forEach((element) => {

		}) */
	});

	column.append(name, button);
	board.insertBefore(column, target);
	columnObject.id = column.id;
	columnObject.cards = [];
	Project.project.columns.push(columnObject);
	console.log(Project.project);

	CardCreator.fillAllSelects();
}

createBoard();
activateDnd();
