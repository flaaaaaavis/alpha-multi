import { ws } from "./Websocket.js";

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

	static onDrop(event) {
		const myColumn = event.target.id;
		if (myColumn != "") {
			const query = `#${myColumn} button`;
			const button = document.querySelector(query);
			const id = event.dataTransfer.getData("text");
			const dragger = document.getElementById(id);
			const dropzone = event.target;
			if (dropzone.classList.contains("coluna")) {
				dropzone.insertBefore(dragger, button);
				const move = {
					tipo: "mover tarefa",
					card: dragger.id,
					coluna: button.parentElement.id,
				};

				ws.send(JSON.stringify(move));
			}
		}
	}

	static droppedOnColumnElement(event) {
		const myColumn = event.currentTarget.parentElement;
		if (myColumn.id != "") {
			const card = event.currentTarget;

			const id = event.dataTransfer.getData("text");
			console.log(id);
			const arrastavel = document.getElementById(id);
			if (myColumn.classList.contains("coluna")) {
				myColumn.insertBefore(arrastavel, card);
				const move = {
					tipo: "mover tarefa",
					card: arrastavel.id,
					coluna: myColumn.id,
					acima: card.id,
				};

				ws.send(JSON.stringify(move));
			}
		}
	}
}
