import CardCreator from "./CardCreator.js";
import DragAndDrop from "./dragAndDrop.js";
import { ws, sala } from "./Websocket.js";
import Api from "./Api.js";

export default class Render {
	static columnCount = 1;
	static addCardCount = 1;

	static createBoard(
		columnNum = 3,
		name,
		id,
		newBoard = true,
		loadedBoard = ""
	) {
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
				switch (i) {
					case 0:
						this.createColumn(false, "A fazer", id);
						break;
					case 1:
						this.createColumn(false, "Fazendo", id);
						break;
					case 2:
						this.createColumn(false, "Feito", id);
						break;
				}
			}
		} else {
			for (let i = 0; i < columnNum; i++) {
				this.renderColumn(loadedBoard.columns[i]);
			}
		}
	}

	static async createColumn(send, columnName = "Nova coluna", id) {
		const body = {
			projeto_id: id,
			nome: columnName,
			ordem: this.columnCount,
		};
		console.log(id);
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
				ordem: this.columnCount,
				id: column.id,
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
			if (
				confirm(
					"Tem certeza que deseja excluir a coluna? Ela e todos os dados que ela contém serão perdidos!"
				) == true
			) {
				const change = {
					id: column.id,
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
			console.log(columnId);
			CardCreator.createCard(button.id, true, columnId);
		});

		column.append(header, button);
		board.insertBefore(column, document.querySelector(".adicionar-coluna"));
		const newColumn = {
			sala: sala,
			tipo: "nova coluna",
			id: column.id,
			contagem: this.columnCount,
		};
		if (send) {
			ws.send(JSON.stringify(newColumn));
		}
		this.columnCount++;
	}

	static async renderColumn(columnElement) {
		console.log(columnElement);
		const board = document.querySelector(".quadro");
		const column = document.createElement("div");
		column.className = "coluna";
		column.id = `coluna-${columnElement.id}`;
		column.value = columnElement.id;
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
			//const id = localStorage.getItem("@dm-kanban:id");
			const change = {
				projeto_id: id,
				nome: name.value,
				ordem: this.columnCount,
				id: column.id,
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
			if (
				confirm(
					"Tem certeza que deseja excluir a coluna? Ela e todos os dados que ela contém serão perdidos!"
				) == true
			) {
				const change = {
					id: column.id,
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

		column.append(header, button);
		board.insertBefore(column, document.querySelector(".adicionar-coluna"));
		this.columnCount++;
	}

	static async renderData(data) {
		data.columns.forEach(async (column) => {
			const task = await Api.getTaskByCategory(column.id);
			if (task[0] != undefined) {
				task.forEach((card) => {
					const target = document.querySelector(
						`#coluna-${column.id} .adicionar-card`
					);
					CardCreator.renderCard(target.id, card);
					/* 					const cardName = document.querySelector(
						`#${card.id} .nome__card`
					);
					cardName.innerText = card.name;
					const cardContent = document.querySelector(`#${card.id} p`);
					cardContent.innerText = card.content;
					CardCreator.updateCardMembers(card.members, card.id); */
				});
			}
		});
		CardCreator.updateCardCounter(data.cardCount);
	}
}
