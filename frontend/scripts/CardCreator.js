import DragAndDrop from "./dragAndDrop.js";
import { ws } from "./Websocket.js";

export default class CardCreator {
	constructor() {
		this.ws = ws;
	}

	static cardFirstOpened = true;
	static clickedCard = {
		id: "",
		titulo: "",
		conteudo: "",
	};

	/* conta os cards que já foram criados para utilizar como id (devo modificar no futuro) */
	static cardCounter = 0;

	/* Cria a estrutura básica do card */
	static createCard(target, send) {
		const targetButton = document.getElementById(target);
		const parent = targetButton.parentElement;

		const card = document.createElement("div");
		card.className = "arrastavel";
		card.id = `arrastavel-${this.cardCounter}`;
		card.draggable = true;

		const cardName = document.createElement("h2");
		cardName.className = "nome__card";
		cardName.innerText = "Nome da tarefa";

		this.cardDrag(card);

		const cardContent = document.createElement("p");
		cardContent.className = "conteudo__card";
		cardContent.innerText = "Conteúdo da tarefa";

		card.addEventListener("click", () => {
			this.clickedCard.id = card.id;
			this.clickedCard.titulo = cardName.innerText;
			this.clickedCard.conteudo = cardContent.innerText;
			const select = document.querySelector(".card-modal__move");
			this.fillSelect(select, parent.id);
			this.startCardModal();

			const edit = {
				tipo: "editando tarefa",
				id: card.id,
			};
			ws.send(JSON.stringify(edit));
		});

		card.append(cardName, cardContent);
		parent.insertBefore(card, targetButton);

		if (send) {
			const cardObject = {
				tipo: "nova tarefa",
				local: parent.id,
				botao: targetButton.id,
				nome: "Nome da Tarefa",
				id: `arrastavel-${this.cardCounter}`,
				conteudo: "Adicione o conteúdo",
				membros: [],
			};
			//card.value = JSON.stringify(cardObject);
			ws.send(JSON.stringify(cardObject));
		}

		this.cardCounter++;
	}

	/* Adiciona as funções de drag and drop ao card */
	static cardDrag(card) {
		card.addEventListener("dragstart", (event) => {
			DragAndDrop.onDragStart(event);
			card.classList.add("arrastando");
			const move = {
				tipo: "arrastando tarefa",
				id: card.id,
			};
			ws.send(JSON.stringify(move));
		});
		card.addEventListener("drop", (event) => {
			DragAndDrop.droppedOnColumnElement(event);
		});
		card.addEventListener("dragend", () => {
			card.classList.remove("arrastando");
		});
	}

	/* Cria o menu de select do card (Mobile) */
	static cardSelect(card) {
		const select = document.querySelector(".card-modal__move");
		let atualColumn = card.parentElement.id;
		const targetColumn = select.value;

		if (targetColumn.trim() != "" && targetColumn != atualColumn) {
			const query = document.querySelector(`#${targetColumn} button`);
			const newColumn = document.getElementById(targetColumn);
			newColumn.insertBefore(card, query);
			card.value = targetColumn;

			const move = {
				tipo: "mover tarefa",
				id: card.id,
				coluna: targetColumn,
			};
			ws.send(JSON.stringify(move));
		}
	}

	/* Preenche o menu de select do card (mobile) */
	static fillSelect(select, id) {
		select.innerHTML = "";
		const selectText = document.createElement("option");
		selectText.innerText = "Mover para";
		selectText.value = "";
		select.append(selectText);
		const columns = document.querySelectorAll(".coluna");
		columns.forEach((element) => {
			if (element.id !== id) {
				const name = document.querySelector(
					`#${element.id} input`
				).value;
				const option = document.createElement("option");
				option.innerText = name;
				option.value = element.id;
				select.append(option);
			}
		});
	}

	static startCardModal() {
		/* Show modal */
		const modal = document.querySelector(".modal");
		modal.classList.remove("hidden");
		modal.addEventListener("click", (e) => {
			if (e.target == modal) {
				modal.classList.add("hidden");
				const edit = {
					tipo: "fechar modal",
					id: this.clickedCard.id,
				};
				ws.send(JSON.stringify(edit));
			}
		});
		const title = document.querySelector(".card-modal__nome");
		title.value = this.clickedCard.titulo;
		const content = document.querySelector(".card-modal__conteudo");
		content.value = this.clickedCard.conteudo;
		if (this.cardFirstOpened) {
			this.modalEvents(true);
			this.cardFirstOpened = false;
		} else {
			this.modalEvents(false);
		}
	}

	static modalEvents(activate) {
		let realCard = document.getElementById(this.clickedCard.id);
		/* Close modal */
		const modal = document.querySelector(".modal");
		const closeButton = document.querySelector(".close");

		/* mudar titulo do card */
		const cardModal = document.querySelector(".card-modal");
		cardModal.value = this.clickedCard.id;
		const title = document.querySelector(".card-modal__nome");
		title.value = this.clickedCard.titulo;

		/* Mudar conteudo do card */
		const content = document.querySelector(".card-modal__conteudo");
		content.value = this.clickedCard.conteudo;

		/* Excluir card */
		const deleteBtn = document.querySelector(".deletar-card");

		const select = document.querySelector(".card-modal__move");
		this.fillSelect(select, realCard.parentElement.id);

		if (activate) {
			closeButton.addEventListener("click", () => {
				const edit = {
					tipo: "fechar modal",
					id: this.clickedCard.id,
				};
				ws.send(JSON.stringify(edit));
				modal.classList.add("hidden");
			});

			deleteBtn.addEventListener("click", (e) => {
				e.preventDefault();
				if (
					confirm("Tem certeza que deseja excluir esse card?") == true
				) {
					realCard = document.getElementById(this.clickedCard.id);
					realCard.remove();
					const remove = {
						tipo: "excluir card",
						id: this.clickedCard.id,
					};
					ws.send(JSON.stringify(remove));
					modal.classList.add("hidden");
				}
			});

			content.addEventListener("change", () => {
				const cardContent = document.querySelector(
					`#${this.clickedCard.id} p`
				);
				cardContent.innerText = content.value;
				const change = {
					tipo: "mudança de conteudo - card",
					id: this.clickedCard.id,
					conteudo: content.value,
				};
				ws.send(JSON.stringify(change));
			});

			title.addEventListener("change", () => {
				const cardTitle = document.querySelector(
					`#${this.clickedCard.id} h2`
				);
				cardTitle.innerText = title.value;
				const change = {
					tipo: "mudança de nome - card",
					id: this.clickedCard.id,
					nome: title.value,
				};
				ws.send(JSON.stringify(change));
			});

			select.addEventListener("change", () => {
				realCard = document.getElementById(this.clickedCard.id);
				this.cardSelect(realCard);
				this.fillSelect(select, realCard.parentElement);
				modal.classList.add("hidden");
				const edit = {
					tipo: "fechar modal",
					id: this.clickedCard.id,
				};
				ws.send(JSON.stringify(edit));
			});
		}
	}
}
