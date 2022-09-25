import { ws, sala } from "./Websocket.js";
import updateCard from "./updateCard.js";

export default class DragAndDrop {
	constructor() {
		this.ws = ws;
	}
	static onDragStart(event) {
		event.dataTransfer.setData("text/plain", event.target.id);
	}

	static onDragOver(event) {
		event.preventDefault();
	}

	static async onDrop(event) {
		console.log(event.currentTarget);
		const myColumn = event.currentTarget.id;
		if (myColumn != "") {
			const query = `#${myColumn} .adicionar-card`;
			const button = document.querySelector(query);
			const id = event.dataTransfer.getData("text");
			const dragger = document.getElementById(id);
			let dropzone = event.target;
			if (dropzone.src) {
				dropzone = event.currentTarget;
			}
			if (dropzone.classList.contains("coluna")) {
				console.log(dragger, button);
				dropzone.insertBefore(dragger, button);
				const move = {
					sala: sala,
					tipo: "mover tarefa",
					id: dragger.id,
					coluna: button.parentElement.id,
				};
				const cards = document.querySelectorAll(
					`.coluna-${myColumn.value} .arrastavel`
				);
				console.log(cards);
				cards.forEach((card) => {
					console.log("entrou");
					updateCard(card.value);
				});
				ws.send(JSON.stringify(move));
			}
		}
	}

	static droppedOnColumnElement(event) {
		console.log(event.currentTarget);
		const myColumn = event.currentTarget.parentElement;
		if (myColumn.id != "") {
			const card = event.currentTarget;
			card.classList.remove("arrastando");

			const id = event.dataTransfer.getData("text");
			const arrastavel = document.getElementById(id);
			if (myColumn.classList.contains("coluna")) {
				const button = document.querySelector(
					`#${myColumn.id} .adicionar-card`
				);
				console.log(button);
				myColumn.insertBefore(arrastavel, card);
				const move = {
					sala: sala,
					tipo: "mover tarefa",
					id: arrastavel.id,
					coluna: myColumn.id,
					acima: card.id,
				};

				ws.send(JSON.stringify(move));
			}
		}
	}
}
