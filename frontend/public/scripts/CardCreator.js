import DragAndDrop from "./dragAndDrop.js";
import { ws, sala } from "./Websocket.js";
import Api from "./Api.js";
import updateCard from "./updateCard.js";

let salaAtual = sala;

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
		const cardMembers = document.getElementById(`colaboradores-${card.id}`);
		cardMembers.value = members;
		console.log(cardMembers.value);
	}

	/* Cria a estrutura básica do card */
	static async createCard(target, send, colunaId, cardId = "") {
		if (cardId == "") {
			if (colunaId == undefined) {
				return false;
			}
			const order = document.querySelectorAll(
				`#coluna-${colunaId.id} .arrastavel`
			);
			console.log(order.length);
			console.log(colunaId);
			const body = {
				coluna_id: colunaId.id,
				nome: "Nome da tarefa",
				ordem: order.length,
				tags: "",
				anotacoes: "Conteúdo da tarefa",
				colaboradores: "[]",
			};
			const request = await Api.createTask(body);
			cardId = request.id;
			console.log(request);
		}
		const targetButton = document.getElementById(target);
		const parent = targetButton.parentElement;

		const card = document.createElement("div");
		const cardMembers = document.createElement("input");
		cardMembers.id = `colaboradores-${cardId}`;
		cardMembers.type = "hidden";
		cardMembers.value = "[]";
		card.className = "arrastavel";
		card.id = `tarefa-${cardId}`;
		card.value = cardId;
		card.draggable = true;

		const cardName = document.createElement("h2");
		cardName.className = "nome__card";
		cardName.innerText = "Nome da tarefa";

		this.cardDrag(card);

		const cardContent = document.createElement("p");
		cardContent.className = "conteudo__card";
		cardContent.innerText = "Conteúdo da tarefa";

		card.addEventListener("click", () => {
			this.clickedCard.id = card.value;
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

		card.append(cardName, cardContent, cardMembers);
		parent.insertBefore(card, targetButton);

		if (send) {
			console.log(cardId);
			const cardObject = {
				sala: sala,
				tipo: "nova tarefa",
				local: parent.id,
				botao: targetButton.id,
				nome: "Nome da Tarefa",
				id: cardId,
				anotacoes: "Conteúdo da tarefa",
				membros: [],
			};
			//card.value = JSON.stringify(cardObject);
			ws.send(JSON.stringify(cardObject));
		}

		this.cardCounter++;
	}

	static async renderCard(target, incomingCard) {
		console.log(target, incomingCard);
		const targetButton = document.getElementById(target);
		const parent = targetButton.parentElement;
		console.log(parent);

		const card = document.createElement("div");

		card.className = "arrastavel";
		card.id = `tarefa-${incomingCard.id}`;
		card.value = incomingCard.id;
		const cardMembers = document.createElement("input");
		cardMembers.id = `colaboradores-${incomingCard.id}`;
		cardMembers.type = "hidden";
		cardMembers.value = incomingCard.colaboradores;
		card.draggable = true;

		const cardName = document.createElement("h2");
		cardName.className = "nome__card";
		cardName.innerText = incomingCard.nome;

		this.cardDrag(card);

		const cardContent = document.createElement("p");
		cardContent.className = "conteudo__card";
		cardContent.innerText = incomingCard.anotacoes;

		card.addEventListener("click", () => {
			this.clickedCard.id = incomingCard.id;
			this.clickedCard.titulo = cardName.innerText;
			this.clickedCard.conteudo = cardContent.innerText;
			const select = document.querySelector(".card-modal__move");
			this.fillSelect(select, parent.id);
			this.startCardModal();

			const edit = {
				sala: sala,
				tipo: "editando tarefa",
				id: incomingCard.id,
			};
			ws.send(JSON.stringify(edit));
		});

		card.append(cardName, cardContent, cardMembers);
		parent.insertBefore(card, targetButton);

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
			console.log(card.parentElement);
			const cards = document.querySelectorAll(
				`#coluna-${card.parentElement.value} .arrastavel`
			);
			cards.forEach((uniqueCard) => {
				console.log("entrou");
				updateCard(uniqueCard.value);
			});
		});
		card.addEventListener("dragend", () => {
			card.classList.remove("arrastando");
		});
	}

	/* Cria o menu de select do card (Mobile) */
	static cardSelect(card) {
		const select = document.querySelector(".card-modal__move");
		console.log(card);
		let atualColumn = card.parentElement.id;
		const targetColumn = select.value;

		if (targetColumn.trim() != "" && targetColumn != atualColumn) {
			const query = document.querySelector(
				`#${targetColumn} .adicionar-card`
			);
			const newColumn = document.getElementById(targetColumn);

			newColumn.insertBefore(card, query);
			updateCard(card.value);
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
		let realCard = document.getElementById(`tarefa-${this.clickedCard.id}`);
		/* Close modal */
		const modal = document.querySelector(".modal");
		const closeButton = document.querySelector(".close");

		/* mudar titulo do card */
		const cardModal = document.querySelector(".card-modal");
		cardModal.value = this.clickedCard.id;
		const title = document.querySelector(".card-modal__nome");
		title.value = this.clickedCard.titulo;

		/* membros */

		this.renderMembers(this.clickedCard.id);

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
				const cardMembers = document.querySelector(".membros--modal");
				if (cardMembers) {
					cardMembers.remove();
				}
				ws.send(JSON.stringify(edit));
				modal.classList.add("hidden");
			});

			deleteBtn.addEventListener("click", async (e) => {
				e.preventDefault();
				if (
					confirm("Tem certeza que deseja excluir esse card?") == true
				) {
					realCard = document.getElementById(
						`tarefa-${this.clickedCard.id}`
					);

					const remove = {
						sala: sala,
						tipo: "excluir card",
						id: this.clickedCard.id,
					};
					const request = await Api.deleteTask({
						id: this.clickedCard.id,
					});
					console.log(request);
					realCard.remove();
					ws.send(JSON.stringify(remove));
					modal.classList.add("hidden");
				}
			});

			content.addEventListener("change", () => {
				const cardContent = document.querySelector(
					`#tarefa-${this.clickedCard.id} p`
				);
				cardContent.innerText = content.value;
				const change = {
					sala: sala,
					tipo: "mudança de conteudo - card",
					id: this.clickedCard.id,
					conteudo: content.value,
				};
				updateCard(this.clickedCard.id);
				ws.send(JSON.stringify(change));
			});

			title.addEventListener("change", () => {
				const cardTitle = document.querySelector(
					`#tarefa-${this.clickedCard.id} h2`
				);
				cardTitle.innerText = title.value;
				const change = {
					sala: sala,
					tipo: "mudança de nome - card",
					id: this.clickedCard.id,
					nome: title.value,
				};
				updateCard(this.clickedCard.id);
				ws.send(JSON.stringify(change));
			});

			select.addEventListener("change", () => {
				const realCard = document.getElementById(
					`tarefa-${this.clickedCard.id}`
				);
				this.cardSelect(realCard);
				this.fillSelect(select, realCard.parentElement);
				modal.classList.add("hidden");
				const membersModal = document.querySelector(".membros--modal");
				membersModal.remove();
				const edit = {
					sala: sala,
					tipo: "fechar modal",
					id: this.clickedCard.id,
				};
				ws.send(JSON.stringify(edit));
			});

			modal.addEventListener("click", (event) => {
				if (event.target == modal) {
					modal.classList.add("hidden");
					const membersModal =
						document.querySelector(".membros--modal");
					membersModal.remove();
				}
			});
		}
	}

	static async createMembersModal(card) {
		const body = {
			id: localStorage.getItem("@dm-kanban:id"),
		};
		const members = await Api.getUsersByProject(body);
		const cardMembersInfo = document.getElementById(
			`colaboradores-${card.value}`
		);

		const usableCardMembersList = JSON.parse(cardMembersInfo.value);
		await members.projetos.forEach(async (member) => {
			const info = await Api.getUserById(member.usuario_id);
			const memberCard = document.createElement("li");
			memberCard.className = "card-membros";
			const memberName = document.createElement("p");
			memberName.className = "text-2";
			memberName.innerText = `${info.usuario} (${info.email})`;
			memberCard.append(memberName);
			if (
				!usableCardMembersList.some((e) => e.usuario === info.usuario)
			) {
				const addMemberButton = document.createElement("button");
				addMemberButton.className = "adicionar-btn";
				addMemberButton.innerText = "+";
				addMemberButton.addEventListener("click", () => {
					usableCardMembersList.push(info);
					membersModal.remove();
					cardMembersInfo.value = JSON.stringify(
						usableCardMembersList
					);
					updateCard(this.clickedCard.id);
					const change = {
						sala: sala,
						tipo: "mudança de membros - card",
						id: this.clickedCard.id,
						membros: usableCardMembersList,
					};
					ws.send(JSON.stringify(change));
					this.renderMembers(card.value);
					this.createMembersModal(card);
				});
				memberCard.append(addMemberButton);
			} else {
				const removeMemberButton = document.createElement("button");
				removeMemberButton.className = "remover-btn";
				removeMemberButton.innerText = "-";

				removeMemberButton.addEventListener("click", () => {
					usableCardMembersList.forEach((element) => {
						if (element.id == info.id) {
							const position =
								usableCardMembersList.indexOf(element);
							usableCardMembersList.splice(position, 1);
						}
					});
					console.log(usableCardMembersList);
					membersModal.remove();
					cardMembersInfo.value = JSON.stringify(
						usableCardMembersList
					);
					updateCard(this.clickedCard.id);
					const change = {
						sala: sala,
						tipo: "mudança de membros - card",
						id: this.clickedCard.id,
						membros: usableCardMembersList,
					};
					ws.send(JSON.stringify(change));
					this.renderMembers(card.value);
					this.createMembersModal(card);
				});

				memberCard.append(removeMemberButton);
			}

			membersList.appendChild(memberCard);
			//boardMembers.push(info);
		});
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

		membersModal.append(modalHeader, membersList);
		target.after(membersModal);
	}

	static async renderMembers(id) {
		console.log(id);
		const realCard = document.getElementById(`tarefa-${id}`);
		const cardMembers = document.getElementById("membros--lista-membros");
		const cardMembersList = document.getElementById(`colaboradores-${id}`);
		const usableCardMembersList = JSON.parse(cardMembersList.value);
		cardMembers.innerHTML = "";
		usableCardMembersList.forEach((element) => {
			const taskMember = document.createElement("li");
			taskMember.innerText = element.usuario;
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
