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
		coluna: "",
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
			this.clickedCard.coluna = parent.id;
			card.value = parent.id;
			this.startCardModal();
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
			card.value = JSON.stringify(cardObject);
			ws.send(JSON.stringify(cardObject));
		}

		this.cardCounter++;
	}

	/* Adiciona as funções de drag and drop ao card */
	static cardDrag(card) {
		card.addEventListener("dragstart", (event) => {
			DragAndDrop.onDragStart(event);
		});
		card.addEventListener("drop", (event) => {
			DragAndDrop.droppedOnColumnElement(event);
			CardCreator.fillAllSelects();
		});
	}

	/* Cria o menu de select do card (Mobile) */
	static cardSelect(e, card) {
		let myParent = card.parentElement;
		let id = myParent.id;
		const myOption = e.target.value;
		const select = e.currentTarget;

		if (myOption.trim() != "" && myOption != id) {
			const query = document.querySelector(`#${myOption} button`);
			const newColumn = document.getElementById(myOption);
			newColumn.insertBefore(card, query);
			this.fillSelect(select, myOption);

			const move = {
				tipo: "mover tarefa",
				card: card.id,
				coluna: myOption,
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

	/* Atualiza o menu de select de todos os cards */
	static fillAllSelects() {
		const targets = document.querySelectorAll(".card-modal__move");

		targets.forEach((element) => {
			element.innerHTML = "";
			const atualLocation = this.clickedCard.coluna;
			const selectText = document.createElement("option");
			selectText.innerText = "Mover para";
			selectText.value = "";
			element.append(selectText);
			const columns = document.querySelectorAll(".coluna");
			columns.forEach((coluna) => {
				if (coluna.id !== atualLocation.id) {
					const name = document.querySelector(
						`#${coluna.id} input`
					).value;
					const option = document.createElement("option");
					option.innerText = name;
					option.value = coluna.id;
					element.append(option);
				}
			});
		});
	}

	static startCardModal() {
		/* Show modal */
		const modal = document.querySelector(".modal");
		modal.classList.remove("hidden");
		modal.addEventListener("click", (e) => {
			if (e.target == modal) {
				modal.classList.add("hidden");
			}
		});
		const title = document.querySelector(".card-modal__nome");
		title.value = this.clickedCard.titulo;
		const content = document.querySelector(".card-modal__conteudo");
		content.value = this.clickedCard.conteudo;
		if (this.cardFirstOpened) {
			this.modalChanges();
		}
	}

	static modalChanges() {
		const realCard = document.getElementById(this.clickedCard.id);
		/* Close modal */
		const modal = document.querySelector(".modal");
		const closeButton = document.querySelector(".close");
		closeButton.addEventListener("click", () => {
			modal.classList.add("hidden");
		});

		/* mudar titulo do card */
		const cardModal = document.querySelector(".card-modal");
		cardModal.value = this.clickedCard.id;
		const title = document.querySelector(".card-modal__nome");
		title.value = this.clickedCard.titulo;
		title.addEventListener("change", () => {
			const cardTitle = document.querySelector(
				`#${this.clickedCard.id} h2`
			);
			console.log(cardTitle);
			cardTitle.innerText = title.value;
			const change = {
				tipo: "mudança de nome - card",
				id: this.clickedCard.id,
				nome: title.value,
			};
			ws.send(JSON.stringify(change));
		});

		/* Mudar conteudo do card */
		const content = document.querySelector(".card-modal__conteudo");
		content.value = this.clickedCard.conteudo;
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

		/* Excluir card */
		const deleteBtn = document.querySelector(".deletar-card");
		deleteBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if (confirm("Tem certeza que deseja excluir esse card?") == true) {
				realCard.remove();
				const remove = {
					tipo: "excluir card",
					id: this.clickedCard.id,
				};
				ws.send(JSON.stringify(remove));
				modal.classList.add("hidden");
			}
		});

		const select = document.querySelector(".card-modal__move");
		if (this.cardFirstOpened) {
			this.fillSelect(select, realCard.value);
			this.cardFirstOpened = false;
		}
		select.addEventListener("change", (e) => {
			realCard.value = select.value;
			this.cardSelect(e, realCard);
			modal.classList.add("hidden");
		});
	}
}
