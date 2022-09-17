import CardCreator from "./CardCreator.js";
import DragAndDrop from "./dragAndDrop.js";
import { ws, sala } from "./Websocket.js";

export default class Render {
	static columnCount = 1;
	static addCardCount = 1;

	static createBoard() {
		const projectTitle = document.getElementById("nome-projeto");
		projectTitle.addEventListener("change", () => {
			if (projectTitle.value.trim() != "") {
				Project.changeName(projectTitle.value.trim());
			}
		});
		const board = document.querySelector(".quadro");
		projectTitle.value = "Novo quadro";
		board.innerHTML = "";

		const addColumnBtn = document.createElement("button");
		addColumnBtn.className = "adicionar-coluna";
		addColumnBtn.title = "Criar nova coluna";
		const img = document.createElement("img");
		img.src = "../assets/icons/new-column.png";
		addColumnBtn.append(img);
		addColumnBtn.addEventListener("click", () => {
			this.createColumn(true);
		});
		board.append(addColumnBtn);
		this.createColumn(false);
		this.createColumn(false);
	}

	static createColumn(send) {
		console.log("send");
		const board = document.querySelector(".quadro");
		const column = document.createElement("div");
		column.className = "coluna";
		column.id = `coluna-${this.columnCount}`;
		column.addEventListener("drop", (event) => {
			DragAndDrop.onDrop(event);
		});
		column.addEventListener("dragover", (event) => {
			DragAndDrop.onDragOver(event);
		});

		const name = document.createElement("input");
		name.placeholder = "nome da coluna";
		name.value = `Nova coluna ${this.columnCount}`;
		name.addEventListener("change", () => {
			const newName = {
				sala: sala,
				tipo: "mudança de nome - coluna",
				id: column.id,
				nome: name.value,
			};
			ws.send(JSON.stringify(newName));
		});
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
			CardCreator.createCard(button.id, true);
		});

		column.append(name, button);
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

	static renderData(data) {
		data.columns.forEach((column) => {
			const title = document.querySelector(`#${column.id} input`);
			title.value = column.name;
			column.cards.forEach((card) => {
				const target = document.querySelector(`#${column.id} button`);
				CardCreator.createCard(target.id, false, card.id);
				const cardName = document.querySelector(
					`#${card.id} .nome__card`
				);
				cardName.innerText = card.name;
				const cardContent = document.querySelector(`#${card.id} p`);
				cardContent.innerText = card.content;
				CardCreator.updateCardMembers(card.members, card.id);
			});
		});
		CardCreator.updateCardCounter(data.cardCount);
	}
}
