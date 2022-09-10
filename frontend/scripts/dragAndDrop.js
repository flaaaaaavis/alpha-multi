export default class DragAndDrop{
	static onDragStart(event) {
		event.dataTransfer.setData("text/plain", event.target.id);
	}

	static onDragOver(event) {
		event.preventDefault();
	}

/* 	static onDragMobile(event){
		let touchLocation = event.targetTouches[0];
		const card = event.currentTarget;
		card.style.position = 'relative';
		//card.style.width = '300px';
		card.style.left = (touchLocation.pageX - 150) + 'px';
		card.style.top = touchLocation.pageY + 'px';
	}

	static onDragMobileEnds(event){
		console.log(event)
		const card = event.currentTarget;
		card.style.position = 'static';
		card.style.width = '95%';
	} */

	static onDrop(event) {
		const myColumn = event.target.id;
		if(myColumn != ''){
			const query = `#${myColumn} button`;
			const button = document.querySelector(query);
			const id = event.dataTransfer.getData("text");
			const arrastavel = document.getElementById(id);
			const dropzone = event.target;
			if (dropzone.classList.contains("coluna")) {
				dropzone.insertBefore(arrastavel, button);
			}
		}
	}

	static droppedOnColumnElement(event){
		const myColumn = event.currentTarget.parentElement;
		if(myColumn.id != ''){
			const card = event.currentTarget;
			const id = event.dataTransfer.getData("text");
			console.log(id)
			const arrastavel = document.getElementById(id);
			if (myColumn.classList.contains("coluna")) {
				myColumn.insertBefore(arrastavel, card);
			}
		}
	}
}
