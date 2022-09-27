import CardCreator from "./CardCreator.js";
import DragAndDrop from "./dragAndDrop.js";
import { ws, sala } from "./Websocket.js";
import Api from "./Api.js";

export default class Render {
	static columnCount = 1;
	static renderColumnCount = 1;
	static addCardCount = 1;

	/* Cria o projeto */
	static async createBoard(
		columnNum = 3,
		name,
		id,
		newBoard = true,
		loadedBoard = ""
	) {
		console.log(id);
		this.renderColumnCount = 1;
		this.columnCount = 1;
		const projectTitle = document.getElementById("nome-projeto");
		const board = document.querySelector(".quadro");
		projectTitle.value = name;
		board.innerHTML = "";

		const addColumnBtn = document.createElement("button");
		addColumnBtn.className = "adicionar-coluna";
		addColumnBtn.title = "Criar nova coluna";
		const img = document.createElement("img");
		img.src = "../assets/icons/new-column.png";
		addColumnBtn.append(img);
		addColumnBtn.addEventListener("click", () => {
			this.createColumn(true, "nova coluna", id);
		});
		board.append(addColumnBtn);
		if (newBoard) {
			for (let i = 0; i < columnNum; i++) {
				if (i === 0) {
					await this.createColumn(false, "A fazer", id);
				} else if (i === 1) {
					await this.createColumn(false, "Fazendo", id);
				} else {
					await this.createColumn(false, "Feito", id);
				}
			}
		} else {
			for (let i = 0; i < columnNum; i++) {
				this.renderColumn(loadedBoard.columns[i]);
			}
		}
	}

	/* Cria uma nova coluna */
	static async createColumn(send, columnName = "Nova coluna", id) {
		console.log(id);
		this.renderColumnCount = 1;
		const body = {
			projeto_id: id,
			nome: columnName,
			ordem: this.columnCount,
		};

		const columnId = await Api.createCategory(body);
		console.log(columnId);
		const board = document.querySelector(".quadro");
		const column = document.createElement("div");
		column.className = "coluna";
		column.id = `coluna-${columnId[0].id}`;
		column.value = columnId[0].id;
		column.addEventListener("drop", (event) => {
			DragAndDrop.onDrop(event);
		});
		column.addEventListener("dragover", (event) => {
			DragAndDrop.onDragOver(event);
		});
		const columnOrder = document.createElement("input");
		columnOrder.type = "hidden";
		columnOrder.value = body.ordem;
		columnOrder.id = `coluna-${columnId[0].id}-ordem`;
		const header = document.createElement("header");
		header.className = "coluna--header";
		const name = document.createElement("input");
		name.placeholder = "nome da coluna";
		name.value = columnName;
		name.addEventListener("change", async () => {
			//const id = localStorage.getItem("@dm-kanban:id");
			const change = {
				projeto_id: id,
				nome: name.value,
				ordem: columnOrder.value,
				id: column.value,
			};
			const request = await Api.modifyCategory(change, column.value);
			console.log(request);

			const newName = {
				sala: sala,
				tipo: "mudança de nome - coluna",
				id: column.id,
				nome: name.value,
			};
			ws.send(JSON.stringify(newName));
		});
		const deleteBtn = document.createElement("button");
		deleteBtn.className = "botao-delete";
		const btnImg = document.createElement("img");
		btnImg.src = "../assets/icons/delete.png";
		deleteBtn.addEventListener("click", async () => {
			const deleteModal = document.getElementById("modal--delete-column");
			deleteModal.classList.toggle("hidden");
			if (
				confirm(
					"Tem certeza que deseja excluir a coluna? Ela e todos os dados que ela contém serão perdidos!"
				) == true
			) {
				const change = {
					id: column.value,
				};
				const request = await Api.deleteCategory(change, column.value);
				console.log(request);
				column.remove();
				const removeColumn = {
					sala: sala,
					tipo: "apagar coluna",
					id: column.id,
				};
				ws.send(JSON.stringify(removeColumn));
			}
		});

		deleteBtn.append(btnImg);
		header.append(name, deleteBtn);

		const button = document.createElement("button");
		button.className = "adicionar-card";
		button.id = `add-card-${this.addCardCount}`;
		button.title = "Criar novo card";
		this.addCardCount++;
		const img = document.createElement("img");
		img.src = "../assets/icons/new-card.png";
		button.appendChild(img);

		button.addEventListener("click", (event) => {
			event.preventDefault();
			CardCreator.createCard(button.id, true, columnId[0]);
		});

		column.append(header, button, columnOrder);
		board.insertBefore(column, document.querySelector(".adicionar-coluna"));
		const newColumn = {
			sala: sala,
			tipo: "nova coluna",
			id: column.value,
			nome: "nova coluna",
			ordem: this.columnCount,
		};
		if (send) {
			ws.send(JSON.stringify(newColumn));
		}

		this.columnCount++;
	}

	/* Carrega uma coluna que ja existe */
	static async renderColumn(columnElement) {
		this.columnCount = columnElement.ordem;
		const board = document.querySelector(".quadro");
		const column = document.createElement("div");
		column.className = "coluna";
		column.id = `coluna-${columnElement.id}`;
		column.value = columnElement.id;

		const columnOrder = document.createElement("input");
		columnOrder.type = "hidden";
		columnOrder.value = columnElement.ordem;
		columnOrder.id = `coluna-${columnElement.id}-ordem`;

		column.addEventListener("drop", (event) => {
			DragAndDrop.onDrop(event);
		});
		column.addEventListener("dragover", (event) => {
			DragAndDrop.onDragOver(event);
		});

		const header = document.createElement("header");
		header.className = "coluna--header";
		const name = document.createElement("input");

		name.placeholder = "nome da coluna";
		name.value = columnElement.nome;
		name.addEventListener("change", async () => {
			const id = localStorage.getItem("@dm-kanban:id");
			const change = {
				projeto_id: id,
				nome: name.value,
				ordem: columnOrder.value,
				id: column.value,
			};
			const request = await Api.modifyCategory(change, column.value);
			console.log(request);

			const newName = {
				sala: sala,
				tipo: "mudança de nome - coluna",
				id: column.id,
				nome: name.value,
			};
			ws.send(JSON.stringify(newName));
		});
		const deleteBtn = document.createElement("button");
		deleteBtn.className = "botao-delete";
		const btnImg = document.createElement("img");
		btnImg.src = "../assets/icons/delete.png";
		deleteBtn.addEventListener("click", async () => {
			const deleteModal = document.getElementById("modal--delete-column");
			deleteModal.classList.toggle("hidden");
			if (
				confirm(
					"Tem certeza que deseja excluir a coluna? Ela e todos os dados que ela contém serão perdidos!"
				) == true
			) {
				const change = {
					id: column.value,
				};
				const request = await Api.deleteCategory(change, column.value);
				console.log(request);
				column.remove();
				const removeColumn = {
					sala: sala,
					tipo: "apagar coluna",
					id: column.id,
				};
				ws.send(JSON.stringify(removeColumn));
			}
		});

		deleteBtn.append(btnImg);
		header.append(name, deleteBtn);

		const button = document.createElement("button");
		button.className = "adicionar-card";
		button.id = `add-card-${this.addCardCount}`;
		button.title = "Criar novo card";
		this.addCardCount++;
		const img = document.createElement("img");
		img.src = "../assets/icons/new-card.png";
		button.appendChild(img);

		button.addEventListener("click", (event) => {
			event.preventDefault();
			CardCreator.createCard(button.id, true, columnElement);
		});

		column.append(header, button, columnOrder);
		board.insertBefore(column, document.querySelector(".adicionar-coluna"));
		this.columnCount++;
	}

	/* Carrega as informações de cada tarefa */
	static async renderData(data) {
		data.columns.forEach(async (column) => {
			const task = await Api.getTaskByCategory(column.id);
			if (task[0] != undefined) {
				task.forEach((card) => {
					const target = document.querySelector(
						`#coluna-${column.id} .adicionar-card`
					);
					CardCreator.renderCard(target.id, card);
				});
			}
		});
		CardCreator.updateCardCounter(data.cardCount);
	}
}
