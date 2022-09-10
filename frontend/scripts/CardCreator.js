import DragAndDrop from "./dragAndDrop.js";

export default class CardCreator{

	/* conta os cards que já foram criados para utilizar como id (devo modificar no futuro) */
	static cardCounter = 0;

	/* Cria a estrutura básica do card */
	static createCard(target){
		const parent = target.parentElement;

		const card = document.createElement('div');
		card.className = 'arrastavel';
		card.id = `arrastavel-${this.cardCounter}`;
		card.draggable = true;

		const cardName = document.createElement('h2');
		cardName.contentEditable = true;
		cardName.className = 'nome__card';
		cardName.innerText = 'Nome da tarefa';

		this.cardDrag(card);

		const cardOptions = document.createElement('div');
		cardOptions.className = 'card__opcoes';

		const deleteBtn = document.createElement('img');
		deleteBtn.src = '../assets/delete.png';
		deleteBtn.className = 'card__delete card__botao';
		deleteBtn.addEventListener('click', (e) => {
			e.preventDefault();
			if(confirm('Tem certeza que deseja excluir esse card?') == true){
				card.remove();
			}
		});

		const cardMenu = document.createElement('div');
		cardMenu.className = 'arrastavel__menu hidden';
		const select = document.createElement('select');
		select.className = 'select';

		this.fillSelect(select);

		select.addEventListener('change', (e) => {
			this.cardSelect(e, card);
		})
		cardMenu.append(select);

		const moveBtn = document.createElement('img');
		moveBtn.src = '../assets/mover.png';
		moveBtn.className = 'card__move card__botao';
		moveBtn.addEventListener('click', () => {
			cardMenu.classList.toggle('hidden');
		});
		cardOptions.append(deleteBtn, moveBtn);
		card.append(cardName, cardOptions, cardMenu);
		parent.insertBefore(card, target);
		this.cardCounter++;
	}

	/* Adiciona as funções de drag and drop ao card */
	static cardDrag(card){
		card.addEventListener("dragstart", (event) => {
			DragAndDrop.onDragStart(event);
		});
		card.addEventListener("drop", (event) => {
			DragAndDrop.droppedOnColumnElement(event);
		});
	}

	/* Cria o menu de select do card (Mobile) */
	static cardSelect(e, card){
		let myParent = card.parentElement;
		let id = myParent.id;
		const myOption = e.target.value;
		const select = e.currentTarget;

		if(myOption.trim() != '' && myOption != id){
			const query = document.querySelector(`#${myOption} button`);
			const newColumn = document.getElementById(myOption);
			newColumn.insertBefore(card, query);
			this.fillSelect(select);
			document.querySelector(`#${card.id} .arrastavel__menu`).classList.toggle('hidden');
		}
	}

	/* Preenche o menu de select do card (mobile) */
	static fillSelect(select){
		select.innerHTML = '';

		const selectText = document.createElement('option');
		selectText.innerText = 'Mover para';
		selectText.value = '';
		select.append(selectText);
		const columns = document.querySelectorAll('.coluna');
		columns.forEach((element) => {
			const name = document.querySelector(`#${element.id} input`).value;
			const option = document.createElement('option');
			option.innerText = name;
			option.value = element.id;
			select.append(option);
		});
	}

	/* Atualiza o menu de select de todos os cards */
	static fillAllSelects(){
		const targets = document.querySelectorAll('.select');

		targets.forEach((element) => {
			element.innerHTML = '';
			const selectText = document.createElement('option');
			selectText.innerText = 'Mover para';
			selectText.value = '';
			element.append(selectText);
			const columns = document.querySelectorAll('.coluna');
			columns.forEach((coluna) => {
				const name = document.querySelector(`#${coluna.id} input`).value;
				const option = document.createElement('option');
				option.innerText = name;
				option.value = coluna.id;
				element.append(option);
			});
		})
	}
}
