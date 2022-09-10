export default class CardCreator{

	static cardCounter = 0;

	static createCard(target){
		let tapedTwice = false;
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

		const deleteBtn = document.createElement('img');
		deleteBtn.src = '../assets/delete.png';
		deleteBtn.className = 'card__delete';
		deleteBtn.addEventListener('click', (e) => {
			e.preventDefault();
			if(confirm('Tem certeza que deseja excluir esse card?') == true){
				card.remove();
			}
		})
		const cardMenu = document.createElement('div');
		cardMenu.className = 'arrastavel__menu hidden';
		const select = document.createElement('select');
		select.className = '.select';

		this.fillSelect(select);
/* 		const columns = document.querySelectorAll('.coluna');
		columns.forEach((element) => {
			const option = document.createElement('option');
			option.innerText = element.id;
			option.value = element.id;
			select.append(option);
		}); */
		select.addEventListener('change', (e) => {
			this.cardSelect(e, card);
		})
		cardMenu.append(select);
		card.addEventListener('touchstart', (event) => {
			if(!tapedTwice) {
				tapedTwice = true;
				setTimeout( function() { tapedTwice = false; }, 300 );
				return false;
			}
			event.preventDefault();
			//action on double tap goes below
			const select = event.currentTarget.childNodes[2];
			select.classList.toggle('hidden');
		});
		card.append(cardName, /* cardContent, */ deleteBtn, cardMenu);
		parent.insertBefore(card, target);
		this.cardCounter++;
	}

	static cardDrag(card){
		card.addEventListener("dragstart", (event) => {
			DragAndDrop.onDragStart(event);
		});
		card.addEventListener("drop", (event) => {
			DragAndDrop.droppedOnColumnElement(event);
		});
	}

	static cardSelect(e, card){
		let myParent = card.parentElement;
		let id = myParent.id;
		const myOption = e.target.value;
		const select = e.currentTarget;

		if(myOption.trim() != '' && myOption != id){
			console.log('entrou');
			const query = document.querySelector(`#${myOption} button`);
			const newColumn = document.getElementById(myOption);
			newColumn.insertBefore(card, query);
			this.fillSelect(select);
		}
	}

	static fillSelect(select){
		select.innerHTML = '';
		const selectText = document.createElement('option');
		selectText.innerText = 'Mover para';
		selectText.value = '';
		select.append(selectText);
		const columns = document.querySelectorAll('.coluna');
		columns.forEach((element) => {
			const option = document.createElement('option');
			option.innerText = element.id;
			option.value = element.id;
			select.append(option);
		});
	}
}
