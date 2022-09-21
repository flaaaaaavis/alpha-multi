import DragAndDrop from "./dragAndDrop.js";
import ApiMock from "./ApiMock.js";
import { ws, sala } from "./Websocket.js";
import Api from "./Api.js";

export default class CardCreator {
	constructor() {
		this.ws = ws;
	}

	static cardFirstOpened = true;
	static clickedCard = {
		id: "",
		titulo: "",
		conteudo: "",
		membros: [],
	};

	/* conta os cards que já foram criados para utilizar como id (devo modificar no futuro) */
	static cardCounter = 0;

	static updateCardCounter(counter) {
		this.cardCounter = counter;
	}

	static updateCardMembers(members, id) {
		const card = document.getElementById(id);
		card.members = members;
	}

	/* Cria a estrutura básica do card */
	static async createCard(target, send, colunaId, cardId = "") {
		if (cardId == "") {
			const body = {
				coluna_id: colunaId.id,
				nome: "Nome da tarefa",
				ordem: this.cardCounter,
				tags: "",
				anotacoes: "Conteúdo da tarefa",
			};
			const request = await Api.createTask(body);
			cardId = request.id;
		}
		const targetButton = document.getElementById(target);
		const parent = targetButton.parentElement;

		const card = document.createElement("div");
		card.className = "arrastavel";
		card.id = cardId;
		card.members = [];
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
				sala: sala,
				tipo: "editando tarefa",
				id: card.id,
			};
			ws.send(JSON.stringify(edit));
		});

		card.append(cardName, cardContent);
		parent.insertBefore(card, targetButton);

		if (send) {
			const cardObject = {
				sala: sala,
				tipo: "nova tarefa",
				local: parent.id,
				botao: targetButton.id,
				nome: "Nome da Tarefa",
				id: cardId,
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
				sala: sala,
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
			const query = document.querySelector(
				`#${targetColumn} .adicionar-card`
			);
			const newColumn = document.getElementById(targetColumn);

			newColumn.insertBefore(card, query);
			card.value = targetColumn;

			const move = {
				sala: sala,
				tipo: "mover tarefa",
				id: card.id,
				coluna: targetColumn,
			};
			const edit = {
				sala: sala,
				tipo: "fechar modal",
				id: card.id,
			};
			ws.send(JSON.stringify(edit));
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
					`#${element.id} .coluna--header input`
				);
				const option = document.createElement("option");
				option.innerText = name.value;
				option.value = element.id;
				select.append(option);
			}
		});
	}

	static startCardModal() {
		/* Show modal */
		const modal = document.querySelector(".modal");
		const cardModal = document.querySelector(".card-modal");
		cardModal.classList.remove("hidden");
		modal.classList.remove("hidden");
		modal.addEventListener("click", (e) => {
			if (e.target == modal) {
				modal.classList.add("hidden");
				cardModal.classList.add("hidden");
				const edit = {
					sala: sala,
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
		//const board = ApiMock.getBoard(sala);
		let realCard = document.getElementById(this.clickedCard.id);
		/* Close modal */
		const modal = document.querySelector(".modal");
		const closeButton = document.querySelector(".close");

		/* mudar titulo do card */
		const cardModal = document.querySelector(".card-modal");
		cardModal.value = this.clickedCard.id;
		const title = document.querySelector(".card-modal__nome");
		title.value = this.clickedCard.titulo;

		/* membros */

		this.renderMembers(realCard);

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
					sala: sala,
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
						sala: sala,
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
					sala: sala,
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
					sala: sala,
					tipo: "mudança de nome - card",
					id: this.clickedCard.id,
					nome: title.value,
				};
				ws.send(JSON.stringify(change));
			});

			select.addEventListener("change", () => {
				console.log("x");
				realCard = document.getElementById(this.clickedCard.id);
				this.cardSelect(realCard);
				this.fillSelect(select, realCard.parentElement);
				modal.classList.add("hidden");
				membersModal.classList.add("hidden");
				const edit = {
					sala: sala,
					tipo: "fechar modal",
					id: this.clickedCard.id,
				};
				ws.send(JSON.stringify(edit));
			});
		}
	}

	static createMembersModal(card) {
		const boardMembers = ApiMock.board.members;
		const target = document.querySelector("#membros--lista-membros");

		const membersModal = document.createElement("div");
		membersModal.className = "membros--modal";

		const modalHeader = document.createElement("header");
		const headerTitle = document.createElement("h2");
		headerTitle.className = "text-1";
		headerTitle.innerText = "Membros";

		const modalClose = document.createElement("span");
		modalClose.innerText = "X";
		modalClose.addEventListener("click", () => {
			membersModal.remove();
		});

		modalHeader.append(headerTitle, modalClose);

		const cardMembers = document.createElement("h3");
		cardMembers.className = "text-2";
		cardMembers.innerText = "Membros do quadro";

		const membersList = document.createElement("ul");
		membersList.className = "membros-modal--lista";

		boardMembers.forEach((element) => {
			const memberCard = document.createElement("li");
			memberCard.className = "card-membros";
			const memberName = document.createElement("p");
			memberName.className = "text-2";
			memberName.innerText = `${element.username} (${element.email})`;
			memberCard.append(memberName);
			if (!card.members.some((e) => e.username === element.username)) {
				const addMemberButton = document.createElement("button");
				addMemberButton.className = "adicionar-btn";
				addMemberButton.innerText = "+";
				addMemberButton.addEventListener("click", () => {
					card.members.push(element);
					membersModal.remove();
					this.renderMembers(card);
					this.createMembersModal(card);
				});
				memberCard.append(addMemberButton);
			} else {
				const removeMemberButton = document.createElement("button");
				removeMemberButton.className = "remover-btn";
				removeMemberButton.innerText = "-";

				removeMemberButton.addEventListener("click", () => {
					card.members.splice(card.members.indexOf(element), 1);
					membersModal.remove();
					this.renderMembers(card);
					this.createMembersModal(card);
				});
				memberCard.append(removeMemberButton);
			}

			membersList.appendChild(memberCard);
		});

		membersModal.append(modalHeader, membersList);
		target.after(membersModal);
	}

	static renderMembers(realCard) {
		const cardMembers = document.getElementById("membros--lista-membros");
		cardMembers.innerHTML = "";
		realCard.members.forEach((element) => {
			const taskMember = document.createElement("li");
			taskMember.innerText = element.username;
			taskMember.title = element.email;
			cardMembers.append(taskMember);
		});
		const addMemberButton = document.createElement("button");
		addMemberButton.innerText = "+";
		addMemberButton.className = "adicionar-btn";
		cardMembers.append(addMemberButton);
		addMemberButton.addEventListener("click", () => {
			this.createMembersModal(realCard);
		});
	}
}
