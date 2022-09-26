import Api from "./Api.js";

export default async function updateCard(cardId) {
	const baseId = `tarefa-${cardId}`;
	const card = document.getElementById(baseId);
	const cardName = document.querySelector(`#${baseId} h2`).innerText;
	const notes = document.querySelector(`#${baseId} p`).innerText;
	const members = document.getElementById(`colaboradores-${cardId}`).value;
	const column = card.parentElement;
	const columnCards = document.querySelectorAll(`#${column.id} .arrastavel`);
	let order;
	columnCards.forEach((element, index) => {
		if (element.value == cardId) {
			order = index;
		}
	});
	const cardObject = {
		coluna_id: column.value,
		nome: cardName,
		ordem: order,
		tags: "",
		anotacoes: notes,
		id: cardId,
		colaboradores: members,
	};
	const request = await Api.modifyTask(cardObject);
	console.log(request);
}
